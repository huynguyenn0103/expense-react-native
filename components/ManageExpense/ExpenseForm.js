import { View , StyleSheet, Text, Alert} from "react-native";
import Input from "./Input";
import { useState } from "react";
import Button from "../UI/Button";
import { GlobalStyles } from "../../constants/styles";
const ExpenseForm = ({onCancel, onSubmit, submitButtonLabel, defaultValue}) =>{
    const [inputs, setInputs] = useState({
      amount: {
        value: defaultValue ? defaultValue.amount.toString() : "",
        isValid: true //defaultValue ? true : false,// co the viet thanh !!defaultValue 
      },
      date: {
        value: defaultValue ? defaultValue.date.toISOString().slice(0, 10) : "",
        isValid: true
      },
      description: {
        value: defaultValue ? defaultValue.description : "",
        isValid: true
      },
    });
    const inputChangeHandler = (inputIdentifier, enteredValue) =>{
        setInputs((currentInputValues) => {
            return {
                ...currentInputValues,
                [inputIdentifier] : {value: enteredValue, isValid: true}
            }
        })
    }
    const submitHandler = () =>{
        let standardAmount = inputs.amount.value.replace(/,/g, ".")
        const expenseData = {
            amount: +standardAmount,//NEW
            date: new Date(inputs.date.value),
            description: inputs.description.value
        }
        const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0
        const dateIsValid = expenseData.date.toString() !== 'Invalid Date';
        const descriptionIsValid = expenseData.description.trim().length > 0
        if(!amountIsValid || !dateIsValid || !descriptionIsValid){
            setInputs((curInputs) =>{
                return {
                    amount: {value: curInputs.amount.value, isValid: amountIsValid},
                    date: {value: curInputs.date.value, isValid: dateIsValid},
                    description: {value: curInputs.description.value, isValid: descriptionIsValid}
                }
            })
            return;
        }
        onSubmit(expenseData)
    }
    const formIsInvalid = !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid
    return (
      <View style={styles.form}>
        <Text style={styles.title}>Your Expense</Text>
        <View style={styles.inputsRow}>
          <Input
            style={styles.rowInput}
            label="Amount"
            textInputConfig={{
              keyboardType: "numeric",
              onChangeText: inputChangeHandler.bind(this,'amount'),
              value: inputs.amount.value
            }}
            invalid = {!inputs.amount.isValid}
          />
          <Input
            style={styles.rowInput}
            label="Date"
            textInputConfig={{
              placeholder: "YYYY-MM-DD",
              maxLength: 10,
              onChangeText: inputChangeHandler.bind(this,'date'),
              value: inputs.date.value
            }}
            invalid = {!inputs.date.isValid}
          />
        </View>
        <Input
          label="Description"
          textInputConfig={{
            multiline: true,
            autoCorrect: false, //default
            autoCapitalize: "sentences", //default
            onChangeText: inputChangeHandler.bind(this,'description'),
            value: inputs.description.value
          }}
          invalid = {!inputs.description.isValid}
        />
        {formIsInvalid && <Text style={styles.errorText}>Invalid input values - please check your entered data</Text>}
        <View style={styles.buttons}>
            <Button style={styles.button} mode="flat" onPress={onCancel}>Cancel</Button>
            <Button style={styles.button} onPress={submitHandler}>{submitButtonLabel}</Button>
        </View>
      </View>
    );
}
export default ExpenseForm
const styles = StyleSheet.create({
    form: {
        marginTop: 28
    },
    title:{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 24,
        textAlign: 'center'
    },
    inputsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }, 
    rowInput: {
        flex: 1
    },
    errorText: {
        textAlign: 'center',
        color: GlobalStyles.colors.error500,
        margin: 8
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        minWidth: 120,
        marginHorizontal: 8
    },
})