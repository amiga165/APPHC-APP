import React, { useState, useRef } from 'react';
import {
  ViroVRSceneNavigator,
} from '@viro-community/react-viro';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

import ViroTheatre from './js/ViroMediaPlayer/ViroTheatre';
import Viro360Theatre from './js/ViroMediaPlayer/Viro360Theatre';

import { DATA, headerStyles } from './js/ViroMediaPlayer/constants';
const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.homecontainer}>
        {DATA.map(item => {
          return (
            <TouchableOpacity activeOpacity={0.8} key={item.title} onPress={() => navigation.navigate('ViewList', { id: item.id, title: item.title })}>

              <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient} key={item.title}>

                {/* <View style={styles.homeitem} key={item.title} > */}
                <Text style={styles.title} >{item.title}</Text>
                {/* </View> */}

              </LinearGradient>
            </TouchableOpacity>
          )
        })}
      </View>
    </SafeAreaView>
  )
}
function ViewList({ route, navigation }) {
  const { id } = route.params;
  const findData = (id) => {
    return DATA.filter(item => item.id == id);
  }
  return (
    <SafeAreaView style={styles.container}>
      {
        findData(id)?.[0]?.data?.map((item, index) => {
          return (
            <TouchableOpacity activeOpacity={0.8} key={item.title} onPress={() => navigation.navigate('VR', { index: item.index })}>

              <View style={styles.item} >
                <Text style={styles.title} >{item.title}</Text>
              </View>
            </TouchableOpacity>
          )
        })
      }
    </SafeAreaView>
  )
}
function VRScreen({ route, navigation }) {
  const { index } = route.params;
  const vrnav = useRef(null);
  const handle360 = (index) =>{
    vrnav.current.jump("Viro360Theatre", { scene: Viro360Theatre ,  passProps: { handle2d , index}
  });
  }
  const handle2d = (index) =>{
    vrnav.current.jump("ViroTheatre", { scene: ViroTheatre, passProps : {handle360 , index}  });
  }
  return (
    <ViroVRSceneNavigator
      ref={vrnav}
      initialScene={{
        scene: ViroTheatre,
        passProps: { navigation, index , handle360 }
      }}
      onExitViro={() => navigation.goBack()}
    />
  );
}
function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen options={{ ...headerStyles }} name="Home" component={Home} />
        <Stack.Screen options={({ route }) => ({
          ...headerStyles,
          title: route?.params?.title,
        })} name="ViewList" component={ViewList} />
        <Stack.Screen options={{ headerShown: false }} name="VR" component={VRScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#fff'
  },
  homecontainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  item: {
    backgroundColor: '#4c669f',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  homeitem: {
    backgroundColor: '#eee',
    width: '45%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    color: '#fff'
  },
  linearGradient: {
    // flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 10,
    // width: '45%'
  },
});

export default App;
