import { Dimensions, Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import Colors from "../data/Colors";

type TextFieldProps = {
    label: string,
    onChangeText : ()=> void,
    password : boolean
}

const width = Dimensions.get('screen').width

export default function InputField({label,onChangeText,password = false}:TextFieldProps) {
  return (
    <View>
        {/* <Text style={{
            color: Colors.TEXT_SECONDARY
        }}> {label}</Text> */}
      <View style={styles.inputWrapper}>
        <TextInput
         placeholder={label} 
         placeholderTextColor={Colors.TEXT_PRIMARY}
         onChangeText={onChangeText} 
         secureTextEntry= {password}
         autoCapitalize='none'
         style={styles.input}/>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
      inputWrapper: {
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS=='ios' ? 14: 0,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.TEXT_SECONDARY,
    margin: 'auto',
    marginTop: 20,
    width: width-60
  },
  input: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 16,
  },
})