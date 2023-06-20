import { Text } from "react-native";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useContext, useEffect, useState } from "react";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
const RecentExpenses = () =>{
    //KET HOP CA CONTEXT VAO VI KHI BAT NAVIGATION KHAC LEN THI COMPONENT NAY KHONG BI UNMOUNT NEN KHI ADD VAO NO KHONG NEW RENDER=> KHONG FETCH DATA MOI NHAT
    //=> DUNG CONTEXT API OR REDUX => KHI ADD => CHANGE STATE OF CONTEXT=> RERENDER (KHONG CHAY LAI USEEFFECT FETCH DATA MA DUNG STATE CUA CONTEXT => TOI UU PERFORM) + ADD VAO DATABASE
    // console.log("Render Recent screen")
    const [check, setCheck] = useState(false)
    const [check1, setCheck1] = useState(false)
    const [error, setError] = useState()
    const [isFetching, setIsFetching] = useState(true)
    const expensesCtx = useContext(ExpensesContext)
    useEffect(() => {
        const getExpenses = async () =>{
            try {
                const expenses =  await fetchExpenses()// vi fetchExpenses se tra ra 1 promise
                expensesCtx.setExpenses(expenses)
            } catch (error) {
                setError('Could not fetch expenses')
            }
            setIsFetching(false)
        }
        getExpenses()
    }, [])
    //  console.log(error, isFetching, check, check1)
    //console.log("Rerender")
    if(error && !isFetching) {
        return <ErrorOverlay message={error} onConfirm={() => setError(null)}/>
    }
    if(isFetching) {
        return <LoadingOverlay/>
    }
    const recentExpenses = expensesCtx.expenses.filter((expense) =>{
        const today = new Date()
        const date7DaysAgo = getDateMinusDays(today, 7)
        const isValid = expense.date <= today && expense.date  > date7DaysAgo
        return isValid 
    })
    return (
        <ExpensesOutput expenses={recentExpenses} expensesPeriod="Last 7 Days" fallbackText="No expenses registered for the last 7 days"/>
    )
}
export default RecentExpenses