$(document).ready(function(){
    // recupero o tipo no localstorage
    let tipo = localStorage.getItem("tipo")

    switch (parseInt(tipo)) {
        case 0: // Cliente
                $("#menuTodosPedidos").hide()
                $("#menuIncluirBebida").hide()
                $("#menuAlterarBebida").hide()
                $("#menuIncluirCategoria").hide()
                $("#menuAlterarCategoria").hide()
                $("#menuDashboard").hide()
            break;
        case 1: // Funcionário
                $("#menuTodosPedidos").show()
                $("#menuIncluirBebida").show()
                $("#menuAlterarBebida").show()
                $("#menuIncluirCategoria").show()
                $("#menuAlterarCategoria").show()
                $("#menuDashboard").show()
            break;
    
        default:
            break;
    }
})

$(document).on('click', ".menu li", function(){
    $(".menu li").removeClass("active")
    $(this).addClass("active")
})