import {View, Text, Button} from "react-native";
import {useAuth} from "../context/AuthContext";
import {signOut} from 'firebase/auth'
import {Toast} from 'toastify-react-native'

export default function Home() {
    const {user , logout} = useAuth()

    const handleLogout = async () => {
        try {
            await logout();
            Toast.success("Successfully logged out" , 'bottom');
        }catch (e) {
            console.log(`Error : ${e}`);
            Toast.error("Try again later" , 'bottom')
        }
    }

    return (
        <View>
            <Text>Hello {user.displayName ?? 'User'}</Text>
            <Button title={'Logout'} onPress={handleLogout}></Button>
        </View>
    )
}