/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";
import type { Node } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ActivityIndicator
} from "react-native";
import codePush from "react-native-code-push";
import * as Progress from 'react-native-progress';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";

const codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

const Section = ({ children, title }): Node => {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const [codePushLoaded, setCodePushLoaded] = useState(false);
  const [cpMessage, setMessage] = useState(null);
  const [progress, setProgress] = useState(null);

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(()=>{
    checkCpBundle();
  },[])

  const checkCpBundle = () => {
    setCodePushLoaded(false)
    codePush.sync(
      {
        //set true for notifying user of available update
        updateDialog: false,
        installMode: codePush.InstallMode.IMMEDIATE,
      },
      syncStatusChangeCallback,
      downloadProgressCallback
    );
  };

  const syncStatusChangeCallback = (status) => {
    console.log("syncStatusChangeCallback", status)
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        setMessage("Checking for updates...");
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        setMessage("Downloading package...");
        break;
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        setMessage("Awaiting user action...");
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        setMessage("Installing update...");
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        setMessage("App up to date.");
        setCodePushLoaded(true);
        break;
      case codePush.SyncStatus.UPDATE_IGNORED:
        setMessage("Update cancelled by user.");
        setCodePushLoaded(true);
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        setMessage("Update installed. Restarting app.");
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
        setMessage("An unknown error occurred.");
        setCodePushLoaded(true);
        break;
      default:
        null;
    }
  };

  const downloadProgressCallback = (progress) => {
    setProgress(progress)
  };

  const cpLoaderView = () => {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent:"center",
          backgroundColor: "White",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text>
            {cpMessage ? cpMessage : "Checking for updates..."}{" "}
          </Text>
          <ActivityIndicator color={Colors.tabBlue} />
        </View>

        {progress ? (
          <View style={{ alignItems: "center" }}>
            <Text style={{}}>
              {((progress.receivedBytes / progress.totalBytes) * 100).toFixed(
                2
              )}{" "}
              %
            </Text>
            <Progress.Bar
              progress={progress.receivedBytes / progress.totalBytes}
              width={200}
              unfilledColor={"#FAFAFA"}
              height={8}
              style={{
                borderRadius: 10,
                borderColor: "#c7c7c7",
              }}
            />
          </View>
        ) : null}
      </SafeAreaView>
    );
  };
  
  if (!codePushLoaded) return cpLoaderView();

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <Header />
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={checkCpBundle}
            style={{ backgroundColor: "#004c8f", padding: 15, borderRadius: 8 }}
          >
            <Text
              style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 21 }}
            >
              Sync app
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <Section title="Step Two">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

MyApp = codePush(codePushOptions)(App);
// MyApp = codePush(App);
export default MyApp;
