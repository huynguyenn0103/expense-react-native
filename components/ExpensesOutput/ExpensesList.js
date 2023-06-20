import { FlatList, Text } from "react-native"
import ExpenseItem from "./ExpenseItem";
const renderExpenseitem = (itemData) =>{
    return <ExpenseItem {...itemData.item}/>
}
const ExpensesList = ({expenses}) => {
    return (
      <FlatList
        data={expenses}
        renderItem={renderExpenseitem}
        keyExtractor={(item) => item.id}
      />
    );
}
export default ExpensesList;