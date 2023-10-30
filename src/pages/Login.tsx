import {
	IonButton,
	IonContent,
	IonHeader,
	IonInput,
	IonPage,
	IonTitle,
	IonToolbar,
	useIonAlert,
	useIonLoading,
	useIonRouter,
} from "@ionic/react";
import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FIREBASE_AUTH } from "../config/FirebaseConfig";
import { FirebaseError } from "firebase/app";
import { useAuth } from "../context/AuthContext";

type FormValues = {
	email: string;
	password: string;
};

const Login: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		getValues,
	} = useForm<FormValues>({
		mode: "onBlur",
	});

	const [show, hide] = useIonLoading();
	const [present, dismiss] = useIonAlert();
	const { user } = useAuth();
	const router = useIonRouter();

	useEffect(() => {
		if (user) {
			router.push("/home", "forward", "replace");
		}
	}, [user]);

	const onRegister = async () => {
		//console.log("register:", getValues());
		const { email, password } = getValues();
		await show();
		try {
			const user = await createUserWithEmailAndPassword(
				FIREBASE_AUTH,
				email,
				password
			);
			//console.log(user);
			present({
				header: "Registration success",
				message: "ok",
				buttons: ["OK"],
			});
		} catch (error) {
			if (error instanceof FirebaseError) {
				//console.log(error);
				present({
					header: "Registration failed",
					message: error.message,
					buttons: ["OK"],
				});
			}
		} finally {
			await hide();
		}
	};

	const onLogin = async (data: FormValues) => {
		//console.log(data);
		const { email, password } = data;
		await show();
		try {
			const user = await signInWithEmailAndPassword(
				FIREBASE_AUTH,
				email,
				password
			);
			console.log(user);

			present({
				header: "Login success",
				message: "ok",
				buttons: ["OK"],
			});
		} catch (error) {
			if (error instanceof FirebaseError) {
				//console.log(error);
				present({
					header: "Login failed",
					message: error.message,
					buttons: ["OK"],
				});
			}
		} finally {
			await hide();
		}
	};

	const sendReset = async () => {
		const { email } = getValues();
		await show();
		try {
			const user = await sendPasswordResetEmail(FIREBASE_AUTH, email);
			console.log(user);

			present({
				header: " email sent",
				message: "Please check your inbox for future instructions",
				buttons: ["OK"],
			});
		} catch (error) {
			if (error instanceof FirebaseError) {
				//console.log(error);
				present({
					header: "Reset failed failed",
					message: error.message,
					buttons: ["OK"],
				});
			}
		} finally {
			await hide();
		}
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color={"primary"}>
					<IonTitle>Fire login</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<form onSubmit={handleSubmit(onLogin)}>
					<IonInput
						className={`ion-margin-bottom ${
							errors.email ? "ion-invalid" : "ion-valid"
						} ion-touched`}
						fill="outline"
						labelPlacement="floating"
						label="Email"
						type="email"
						placeholder="max@gmail.com"
						{...register("email", {
							required: true,
							pattern: {
								value: /\S+@\S+\.\S+/,
								message: "Please enter a valid email",
							},
						})}
						errorText={errors.email?.message}
					/>

					<IonInput
						className={`${
							errors.password ? "ion-invalid" : "ion-valid"
						} ion-touched`}
						fill="outline"
						labelPlacement="floating"
						label="Password"
						type="password"
						placeholder="1234567"
						{...register("password", {
							required: true,
							minLength: {
								value: 6,
								message: "Password must have at least 6 characters",
							},
						})}
						errorText={errors.password?.message}
					/>

					<IonButton expand="block" type="submit" disabled={!isValid}>
						Log in
					</IonButton>

					<IonButton
						color={"secondary"}
						expand="block"
						type="button"
						disabled={!isValid}
						onClick={onRegister}
					>
						Create account
					</IonButton>

					<IonButton
						color={"tertiary"}
						expand="block"
						type="button"
						//disable if email field is empty
						disabled={getValues("email") === ""}
						onClick={sendReset}
					>
						Reset Password
					</IonButton>
				</form>
			</IonContent>
		</IonPage>
	);
};

export default Login;
