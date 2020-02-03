const functions = require('firebase-functions');
const request = require('request-promise')

var admin = require('firebase-admin');
var keys = require('./config/keys')

var serviceAccount = require("./config/serviceAccountKey.json");

var client_id = keys.spotify.client_id
var client_secret = keys.spotify.client_secret
var redirect_uri = keys.spotify.redirect_uri

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tuti-943d2.firebaseio.com"
});

exports.createFirebaseAccount = functions.https.onCall(async (data, context) => {
    var code = data.code || null;

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };

    var req = await request.post(authOptions)
    
    if (!req.error) {
        var access_token = req.access_token,
            refresh_token = req.refresh_token;

        // use the access token to access the Spotify Web API
        var me = await request.get({
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        })
            
        return { token: await createFirebaseAccount(me.id, me.display_name, me.email, access_token, refresh_token) }

    } else {
        throw new functions.https.HttpsError('request-error', 'The function had trouble connecting with spotify.');
    }
    
});

async function createFirebaseAccount(spotifyID, displayName, email, accessToken, refresh_token) {

    // The UID we'll assign to the user.
    const uid = 'spotify:' + spotifyID;

    const databaseTask = admin.firestore().collection('users').doc(uid).set({
            access_token: accessToken, 
            refresh_token: refresh_token,
            uid: uid,
            email: email,
            displayName: displayName
        })

    // Create or update the user account.
    const userCreationTask = admin.auth().updateUser(uid, {
        displayName: displayName,
        email: email,
        emailVerified: true,
    }).catch((error) => {
        // If user does not exists we create it.
        if (error.code === 'auth/user-not-found') {
        return admin.auth().createUser({
            uid: uid,
            displayName: displayName,
            email: email,
            emailVerified: true,
        });
        }
        throw error;
    });

    // Wait for all async tasks to complete, then generate and return a custom auth token.
    await Promise.all([userCreationTask, databaseTask]);
    // Create a Firebase custom auth token.
    const token = await admin.auth().createCustomToken(uid);
    return token;
}


exports.getApiToken = functions.https.onCall(async (data, context) => {
    if (context.auth.uid != null && context.auth.uid != undefined) {
        // your application requests authorization
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };

        var token = await request.post(authOptions).catch(error => {
            throw new functions.https.HttpsError('token-error', error);
        });

        if (!token.error) {
            return token;
        } else {
            throw new functions.https.HttpsError('request-error', 'The function had trouble connecting with spotify.');
        }
    } else {
        throw new functions.https.HttpsError('auth-error', 'You are not authorized to perform this funcion...');
    }
});


exports.addTrack = functions.https.onCall(async (data, context) => {
    if (context.auth.uid != null && context.auth.uid != undefined) {

        const trackUri = data.uri;
        
        const ref = admin.firestore().doc(`rooms/${data.roomId}`);

        var room = (await ref.get()).data();
        var host = (await admin.firestore().doc(`users/${room.owner}`).get()).data();

        const updateTrack = ref.collection('tracks').doc(trackUri).set({
            uri: trackUri,
            addedBy: context.auth.uid,
            rank: room.currentTrackLength + 1
        })

        const updatePosition = ref.update({
            currentTrackLength: room.currentTrackLength + 1
        })

        const addToPlaylist = request.post({
            url: `https://api.spotify.com/v1/playlists/${room.playlist_id}/tracks`,
            headers: {
                'Authorization': 'Bearer ' + host.access_token
            },
            body: {
                uris: [trackUri]
            },
            json: true
        }).catch(async error => {
            
            if (error.response.body.error.message == 'The access token expired') {
                const newAccessToken = await refreshToken(host.refresh_token, host.uid);

                await request.post({
                    url: `https://api.spotify.com/v1/playlists/${room.playlist_id}/tracks`,
                    headers: {
                        'Authorization': 'Bearer ' + newAccessToken
                    },
                    body: {
                        uris: [trackUri]
                    },
                    json: true
                }).catch(error => {
                    throw new functions.https.HttpsError('token-error', error);
                })

                return {success: 200}; 

            } else {
                throw new functions.https.HttpsError('token-error', error);
            }
        })

        const task = await Promise.all([updateTrack, updatePosition, addToPlaylist]);
        
        if(!task.error) {
            return {success: 200}; 
        } else {
            throw new functions.https.HttpsError('error', 'An error occured on addition of track.'); 
        }

    } else {
        throw new functions.https.HttpsError('auth-error', 'You are not authorized to perform this funcion.');
    }
})

async function refreshToken(token, uid) {
    const newToken = await request.post({
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) },
        form: {
          grant_type: 'refresh_token',
          refresh_token: token
        },
        json: true
    }).catch(error => {
        throw new functions.https.HttpsError('token-error', error);
    });

    await admin.firestore().doc(`users/${uid}`).update({
        access_token: newToken.access_token
    });

    return newToken.access_token;
}