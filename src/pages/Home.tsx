import {
	IonButton,
	IonButtons,
	IonCheckbox,
	IonContent,
	IonFab,
	IonFabButton,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonItemOption,
	IonItemOptions,
	IonItemSliding,
	IonLabel,
	IonList,
	IonModal,
	IonPage,
	IonTitle,
	IonToolbar,
	useIonLoading,
} from "@ionic/react";
import { useAuth } from "../context/AuthContext";
import {
	addOutline,
	closeOutline,
	cloudDownloadOutline,
	fileTrayOutline,
	logOutOutline,
	trashBinOutline,
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import {
	CollectionReference,
	DocumentData,
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_STORAGE } from "../config/FirebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export interface Task {
	id?: string;
	title: string;
	completed: boolean;
	file?: string;
	user?: string;
	createdAt?: any;
}

const Home: React.FC = () => {
	const { logout, user } = useAuth();
	const modal = useRef<HTMLIonModalElement>(null);
	const [task, setTask] = useState<string>("");
	const [taskCollectionRef, setTaskCollectionRef] =
		useState<CollectionReference>();
	const [tasks, setTasks] = useState<Task[]>([]);

	const [fileToUpload, setFileToUpload] = useState<File | null>(null);
	const fileInput = useRef<HTMLInputElement>(null);

	const [show, hide] = useIonLoading();

	useEffect(() => {
		const taskCollection = collection(FIREBASE_DB, "tasks");
		setTaskCollectionRef(taskCollection);

		const q = query(
			taskCollection,
			where("user", "==", user?.uid),
			orderBy("createdAt", "asc")
		);

		const unsubscribe = onSnapshot(q, (snapshot: DocumentData) => {
			const items = snapshot.docs.map((doc: DocumentData) => {
				return {
					id: doc.id,
					...doc.data(),
				};
			});
			console.log(items);
			setTasks(items);
		});

		return unsubscribe;
	}, []);

	const onDismiss = async (event: CustomEvent) => {
		console.log(event);
		if (event.detail.role === "confirm") {
			const newTask: Task = {
				title: event.detail.data,
				completed: false,
				user: user?.uid,
				createdAt: serverTimestamp(),
			};

			await show();

			if (fileToUpload) {
				const url = await uploadFile();
				console.log("file:Home.tsx:79 onDismiss url:", url);
				newTask.file = url;
			}
			await addDoc(taskCollectionRef!, newTask);
			setTask("");
			await hide();
		}
	};

	const toggleTask = async (task: Task) => {
		task.completed = !task.completed;
		const docRef = doc(FIREBASE_DB, `tasks/${task.id}`);
		console.log(docRef);
		updateDoc(docRef, { completed: task.completed });
	};

	const deleteTask = async (task: Task) => {
		const docRef = doc(FIREBASE_DB, `tasks/${task.id}`);
		deleteDoc(docRef);
	};

	const uploadFile = async () => {
		const storageRef = ref(
			FIREBASE_STORAGE,
			`files/${user?.uid}/${fileToUpload?.name}`
		);
		await uploadBytes(storageRef, fileToUpload!);
		return getDownloadURL(storageRef);
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color={"primary"}>
					<IonButtons slot="end">
						<IonButton onClick={logout}>
							<IonIcon slot="icon-only" icon={logOutOutline} />
						</IonButton>
					</IonButtons>
					<IonTitle>My tasks</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList>
					{tasks.map((task: Task) => (
						<IonItemSliding key={task.id}>
							<IonItem>
								<IonCheckbox
									slot="start"
									checked={task.completed}
									onIonChange={() => toggleTask(task)}
								/>
								<IonLabel>
									{task.title}
									<p>{task.createdAt?.toDate().toLocaleDateString()}</p>
								</IonLabel>

								{task.file && (
									<IonButton
										slot="end"
										fill="clear"
										onClick={() => window.open(task.file, "_blank")}
									>
										<IonIcon slot="icon-only" icon={cloudDownloadOutline} />
									</IonButton>
								)}
							</IonItem>

							<IonItemOptions side="end">
								<IonItemOption color="danger" onClick={() => deleteTask(task)}>
									<IonIcon slot="icon-only" icon={trashBinOutline} />
								</IonItemOption>
							</IonItemOptions>
						</IonItemSliding>
					))}
				</IonList>

				<IonModal
					trigger="add-task"
					breakpoints={[0, 0.5]}
					initialBreakpoint={0.5}
					ref={modal}
					onWillDismiss={onDismiss}
				>
					<IonHeader>
						<IonToolbar color={"secondary"}>
							<IonButtons slot="end">
								<IonButton
									onClick={() => modal.current?.dismiss(null, "cancel")}
								>
									<IonIcon slot="icon-only" icon={closeOutline} />
								</IonButton>
							</IonButtons>
							<IonTitle>Add Task</IonTitle>
						</IonToolbar>
					</IonHeader>
					<IonContent className="ion-padding">
						<IonInput
							label="Task title"
							placeholder="Enter task"
							onIonInput={(e) => setTask(e.detail.value!)}
						/>

						<input
							type="file"
							ref={fileInput}
							hidden
							onChange={(e) => setFileToUpload(e.target.files![0])}
						/>

						<IonButton
							expand="block"
							onClick={() => fileInput.current?.click()}
						>
							<IonIcon slot="start" icon={fileTrayOutline} />
							Upload file
						</IonButton>

						<IonButton
							expand="block"
							onClick={() => modal.current?.dismiss(task, "confirm")}
						>
							Save task
						</IonButton>
					</IonContent>
				</IonModal>
				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton id="add-task">
						<IonIcon icon={addOutline} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
};

export default Home;
