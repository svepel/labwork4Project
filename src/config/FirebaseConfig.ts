// Import the functions you need from the SDKs you need
import { Capacitor } from "@capacitor/core";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
	getAuth,
	indexedDBLocalPersistence,
	initializeAuth,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDmaBDsWqinjbXgFhuRq2odbluFGwCCYEU",
	authDomain: "labwork4-project.firebaseapp.com",
	projectId: "labwork4-project",
	storageBucket: "labwork4-project.appspot.com",
	messagingSenderId: "105442962519",
	appId: "1:105442962519:web:d373a3c3b8e1bb1c9e0712",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const FIREBASE_AUTH = selectAuth();

function selectAuth() {
	let auth;
	if (Capacitor.isNativePlatform()) {
		auth = initializeAuth(FIREBASE_APP, {
			persistence: indexedDBLocalPersistence,
		});
	} else {
		auth = getAuth(FIREBASE_APP);
	}

	return auth;
}
