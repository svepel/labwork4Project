import {
	IonButton,
	IonContent,
	IonHeader,
	IonInput,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

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

	const onRegister = async () => {
		console.log("register:", getValues());
	};

	const onLogin = async (data: FormValues) => {
		console.log(data);
	};

	const sendReset = async () => {};

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
						placeholder="sveta@gmail.com"
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
