import {createStackNavigator} from "@react-navigation/stack";
import React from "react";
import Account from "./screens/Account";
import Messages from "./screens/Messages";
import ManageParkSpace from "./screens/ManageParkSpace";
import ManageAccount from "./screens/ManageAccount";
import Legal from "./screens/Legal";
import MyVehicles from "./screens/MyVehicles";
import AddNewVehicle from "./screens/AddNewVehicle";
import ChangePassword from "./screens/ChangePassword";
import UpdatePersonalDetails from "./screens/UpdatePersonalDetails";
import TransactionsScreen from "./screens/TransactionsScreen";
import RentParkSpace from "./screens/RentParkSpace";
import Screen1 from "./screens/RentYourSpaceScreens/Screen1";
import Screen2 from "./screens/RentYourSpaceScreens/Screen2";
import Screen3 from "./screens/RentYourSpaceScreens/Screen3";

import ParkSpaceDetails from "./screens/ParkSpaceDetails";
import CustomHeader from "./components/CustomHeader";
import {UserParkSpacesProvider} from "./context/UserParkSpacesContext";
import {RentASpaceProvider} from "./context/RentASpaceContext";

function withRentASpaceProvider(Component) {
  return function Wrapper(props) {
    return (
      <RentASpaceProvider>
        <Component {...props} />
      </RentASpaceProvider>
    );
  };
}

function withUserParkSpacesProvider(Component) {
  return function Wrapper(props) {
    return (
      <UserParkSpacesProvider>
        <Component {...props} />
      </UserParkSpacesProvider>
    );
  };
}

const Stack = createStackNavigator();

export default function AccountNavigatorStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {backgroundColor: "white"},
        presentation: "modal",
        cardStyleInterpolator: ({current, next, layouts}) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.7],
              }),
            },
          };
        },
        header: props => {
          const title = props.options.title || props.route.name;
          return <CustomHeader title={title} navigation={props.navigation} />;
        },
      }}
    >
      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: false,
          title: "Account",
        }}
      />
      <Stack.Screen
        name="TransactionsScreen"
        component={TransactionsScreen}
        options={{
          title: "Transactions",
        }}
      />

      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{
          title: "Messages",
        }}
      />
      <Stack.Screen
        name="ManageParkSpace"
        component={withUserParkSpacesProvider(ManageParkSpace)}
        options={{
          title: "My Park Spaces",
        }}
      />
      <Stack.Screen
        name="ParkSpaceDetails"
        component={withUserParkSpacesProvider(ParkSpaceDetails)}
        options={{
          title: "Park Space Details",
        }}
      />
      <Stack.Screen
        name="MyVehicles"
        component={MyVehicles}
        options={{
          title: "My Vehicles",
        }}
      />
      <Stack.Screen
        name="ManageAccount"
        component={ManageAccount}
        options={{
          title: "Manage Account",
        }}
      />
      <Stack.Screen name="Legal" component={Legal} />
      <Stack.Screen
        name="AddNewVehicle"
        component={AddNewVehicle}
        options={{
          title: "Add New Vehicle",
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          title: "Change Password",
        }}
      />
      <Stack.Screen
        name="UpdatePersonalDetails"
        component={UpdatePersonalDetails}
        options={{
          title: "Personal Details",
        }}
      />
      <Stack.Screen
        name="RentParkSpace"
        component={withRentASpaceProvider(RentParkSpace)}
        options={{
          title: "Rent Park Space",
        }}
      />
      <Stack.Screen
        name="Screen1"
        component={withRentASpaceProvider(Screen1)}
        options={{
          title: "Rent Park Space",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Screen2"
        component={withRentASpaceProvider(Screen2)}
        options={{
          title: "Rent Park Space",
        }}
      />
      <Stack.Screen
        name="Screen3"
        component={withRentASpaceProvider(Screen3)}
        options={{
          title: "Rent Park Space",
        }}
      />
    </Stack.Navigator>
  );
}