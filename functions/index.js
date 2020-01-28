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
            accessToken: accessToken, 
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