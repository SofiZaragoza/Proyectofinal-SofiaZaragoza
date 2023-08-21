
const Expenselist = []; //Array para almacenar datos de las expenses

const form = document.getElementById("incomeform");
const formExpense = document.getElementById("expenseForm");
const tablabody = document.getElementById("tablaexpense");
const finalbudget = document.getElementById("totalbudget");

//Expense data para crear las expenses nuevas
class expense {
    constructor (naming,Expname,amount,type){
        this.Name = naming;
        this.Expname = Expname;
        this.Amount = amount;
        this.Etype = type;
    }
}

let campoIncome = 0; // Declare campoIncome fuera de la función para utilizarlo después


function submitIncome() {
    // Get the input value + pareafloat
    campoIncome = parseFloat(document.getElementById("incomeinput").value);

    // valido los datos que sean números y mayores a cero con un if
    if(!isNaN(campoIncome) && campoIncome > 0){
        document.getElementById("incomeinput").textContent = campoIncome;// Display the income value on the page
        localStorage.setItem('income', JSON.stringify(campoIncome));// Store income in local storage 
    }else{
        Swal.fire({/*reemplazo el alert por swal.fire para notificar los problemas*/
            icon: 'error',
            title: 'Oops...',
            text: 'Please, do insert number greater than 0 ',
          })
        
        document.getElementById("incomeinput").textContent = '';
    }
}
    //agrego un addevent listener para validar el boton submit del campoIncome
    form.addEventListener("submit",(ev) =>{
        ev.preventDefault();
        submitIncome()
        const incomeinput = document.getElementById("incomeinput");
        incomeinput.style.backgroundColor = "lightgrey";
        const firstbudget = document.getElementById("totalbudget");
        firstbudget.textContent = `Current Budget:$ ${campoIncome}`;
    })



let sumadegastos = JSON.parse(localStorage.getItem('totalexpense')) || [];
    if (sumadegastos != 0) {
    sumadegastos = JSON.parse(localStorage.getItem('totalexpense'));
    } //estoy intentando renderizar el total de gastos (total expense) y hay algo que me falta y no se refelja correctamente.

function submitExpense() {
    let username = document.getElementById("userName").value;
    let expensename =  document.getElementById("expenseName").value;
    let expensetype = document.getElementById("expenseType").value;
    let expenseamount =  parseFloat(document.getElementById("expenseAmount").value);
    //valido que tenga un mín de palabras, los numeros con una expresión regular (tuve que pedir ayuda en coderhouse) 
    if(!/^[A-Za-z]{3,}$/.test(username) || isNaN(expenseamount)||expenseamount <= 0 ){//usamos una expresión regular para validar los datos
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please, names are not alphanumeric (only letters) & expenses should be greater than 0 ',
          })
    }else{
        document.getElementById("userName").textContent = username;
        const newExpense = new expense(username,expensename,expenseamount,expensetype);
        Expenselist.push(newExpense);
        console.table(Expenselist);
        
        sumadegastos = Expenselist.reduce((total,expense) => total + expense.Amount,0)
        console.log("testing de gastos "+ sumadegastos);
        const totalExpenseElement = document.getElementById("totalexpensemonth");
        totalExpenseElement.textContent = `Total Expense:$ ${sumadegastos}`;
        localStorage.setItem('totalexpense', JSON.stringify(sumadegastos)); //store the total expenses 
        localStorage.setItem('expenses', JSON.stringify(Expenselist)); // Store expenses in local storage con STRING
        
        tablaexpense.innerHTML +=`
        <tr>
            <td>${newExpense.Name}</td>
            <td>${newExpense.Expname}</td>
            <td>${newExpense.Etype}</td>
            <td>${newExpense.Amount}</td>
        </tr>
    `; 
    }
}
//fuera de la función valido el submit con un eventlistener para que funcione el boton

formExpense.addEventListener("submit",(ev) =>{
    ev.preventDefault();
    submitExpense() 

    const calculatebudget = (totalincome,totalbudget) => {return totalincome - totalbudget}
    const totalbudget = calculatebudget (campoIncome,sumadegastos);

    const totalbudgetelement = document.getElementById("totalbudget");
    totalbudgetelement.textContent = `Current Budget: $ ${totalbudget}`;

    console.log(totalbudget);
})

    //renderizamos la tabla de gastos para cuando le damos refresh 

    let renderizarExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    if (renderizarExpenses.length != 0){
        for(const Expense of renderizarExpenses){
         tablaexpense.innerHTML +=`
            <tr>
                <td>${Expense.Name}</td>
                <td>${Expense.Expname}</td>
                <td>${Expense.Etype}</td>
                <td>${Expense.Amount}</td>
            </tr>
        `; 
        }
    }

let finalizarBtn = document.getElementById('deleteData');
//eliminamos toda la data de storage y la información que populamos anteriormente
finalizarBtn.onclick = () => {
    document.getElementById("incomeinput").value = "";
    Expenselist.length = 0; // cannot re-declare a const in the JS, lo establezco en cero
    document.getElementById("tablaexpense").innerHTML = "";
    document.getElementById("totalexpensemonth").textContent = `Total Expense:$` + "";
    document.getElementById("totalbudget").textContent = `Current Budget:`+ "";
    localStorage.removeItem('income'); // Clear stored income
    localStorage.removeItem('expenses'); // Clear stored expenses
    localStorage.removeItem('totalexpense');
    
}

// Conexión con Json interno (no encontre algo en la API)
function obtenerJsonPropio(){
    const URLJSON = "/months.json";
    fetch(URLJSON)
    .then( resp => resp.json())
    .then( data => {
        console.log(data.past2023); //all the data of the json (array 5)
        const mesesPasados = data.past2023;
        console.log(mesesPasados); // check the const it´s OK 
        mesesPasados.forEach(past2023 => {
        document.getElementById("past2023").innerHTML += `
        <tr>
            <td>${past2023.month}</td>
            <td>${past2023.expenses}</td>
            <td>${past2023.budget}</td>
        </tr>
        `;
        });
    });
}
    
obtenerJsonPropio();