import { useContext, useLayoutEffect, useState } from "react";
import { TouchableWithoutFeedback, View, Keyboard } from "react-native";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import { StyleSheet } from "react-native";
import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { deleteExpense, storeExpense, updateExpense } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
const ManageExpense = ({route, navigation}) =>{
    // console.log("Render Manage screen")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState()
    const expensesCtx = useContext(ExpensesContext)
    const editedExpenseId = route.params?.expenseId;
    const isEditing = !!editedExpenseId// falsy => false truthy-> true
    const selectedExpense = expensesCtx.expenses.find(expense => expense.id === editedExpenseId)
    useLayoutEffect(() =>{
        navigation.setOptions({
            title: isEditing? 'Edit Expense' : 'Add Expense'
        })
    }, [navigation, isEditing])
    const deleteExpenseHandler = async () =>{
        setIsSubmitting(true)// vi o duoi la await => tai day se rerender UI ****
        try {
            await deleteExpense(editedExpenseId)
            //await new Promise(r => setTimeout(r, 2000));
            expensesCtx.deleteExpense(editedExpenseId)
           navigation.goBack()
        } catch (error) {
            setError("Could not delete expense - please try again later")
            setIsSubmitting(false)  
        }    
    }
    const cancelHandler = () =>{
        navigation.goBack()
    }
    // There is another subtle problem after calling an async function. Array mutation causes immediate re-rendering
    const confirmHandler = async (expenseData) =>{
        setIsSubmitting(true)
        try {
            if(isEditing) {
                expensesCtx.updateExpense(editedExpenseId, expenseData);
                await updateExpense(editedExpenseId, expenseData)
            }
            else{
                const id = await storeExpense(expenseData)
                expensesCtx.addExpense({...expenseData, id : id})
            }
            navigation.goBack()
        } catch (error) {
            setError('Could not save data - please try again later')
            setIsSubmitting(false)
        }

        
    }
    //  console.log(error,isSubmitting, check, check1)
    if(error && !isSubmitting){
        return <ErrorOverlay message={error} onConfirm={() => setError(null)}/>
    }
    if(isSubmitting){
        return <LoadingOverlay/>
    }
    return (
     <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ExpenseForm onCancel={cancelHandler} submitButtonLabel={isEditing? 'Update' : 'Add'} onSubmit={confirmHandler} defaultValue = {selectedExpense}/>
        
        {isEditing && (
          <View style={styles.deleteContainer}> 
            <IconButton
              icon="trash"
              color={GlobalStyles.colors.error500}
              size={36}
              onPress={deleteExpenseHandler}
            />
          </View>
        )}
      </View>
      </TouchableWithoutFeedback>
    );
}
export default ManageExpense
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800
    },

    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center'
    }
})