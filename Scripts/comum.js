$(document).ready(function(){

    //recupero o email no localstorage
    let email = localStorage.getItem("nome")
    $('#userLogadoEmail').text(email)

})