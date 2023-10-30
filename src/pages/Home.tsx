import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { useAuth } from "../context/AuthContext";
import { logOutOutline } from "ionicons/icons";

const Home: React.FC = () => {
	const { logout } = useAuth();

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="end">
						<IonButton onClick={logout}>
							<IonIcon slot="icon-only" icon={logOutOutline} />
						</IonButton>
					</IonButtons>
					<IonTitle>Home</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen></IonContent>
		</IonPage>
	);
};

export default Home;
