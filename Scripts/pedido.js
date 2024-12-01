$(document).on('click', '#finalizar-pedido', async function () {
    await salvarPedido()
})

async function recuperarUsuario(id){
    var usuarioData = {}
    await $.ajax({
        type: 'GET',
        url: 'https://deploy-planalto.onrender.com/Usuario/'+id,
        success: function (data) {
            usuarioData = {
                "id": data.id,
                "email": data.email,
                "senha": data.senha,
            }
        }
    })
    return usuarioData
}

async function salvarPedido(){
    var valorTotal = 0.00
    var carrinho = JSON.parse(localStorage.getItem('carrinho'))

    carrinho.forEach(item => {
        var total = parseFloat(item.valorTotalProduto)
        valorTotal += total
    });
    gerarQRCode(valorTotal)
    
}

async function gerarQRCode(valor){
    	
    $.ajax({
        url: 'https://deploy-planalto.onrender.com/Pedido/GerarBrCode/' + valor,
        type: 'GET',
        async: true,
        success: function (data) {
            $("#qrCodePix").attr('src', "https://gerarqrcodepix.com.br/api/v1?brcode="+data)+"&tamanho=256"
            $("#brcode").text(data)
            $("#finalizar-pedido").hide(300)
            alert('Por favor, realize o pagamento')
        }, complete: async function(){

            const idUsuario = localStorage.getItem('id')
            var usuarioData = await recuperarUsuario(idUsuario)
        
            var valorTotal = 0.00
            var carrinho = JSON.parse(localStorage.getItem('carrinho'))
        
            carrinho.forEach(item => {
                var total = parseFloat(item.valorTotalProduto)
                valorTotal += total
            });

            var pedidoData = {
                "usuario": usuarioData,
                "valorpedido": valorTotal,
                "data": null,
                "brCode": $("#brcode").text()
            }
        
            $('.wrapPix').show();

            $.ajax({
                type: 'POST',
                url: 'https://deploy-planalto.onrender.com/Pedido',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(pedidoData),
                success: function (data) {
                    alert('Pedido realizado com sucesso!')
                    recuperarInformacoesPedidoBebida(data)
                }, complete: function(){
                    localStorage.removeItem('carrinho')
                }
            })
        }
        
    })
}

async function recuperarInformacoesPedidoBebida(pedido){
    var carrinho = JSON.parse(localStorage.getItem('carrinho'))
    var pedidoBebidaData = []

    for (const item of carrinho) {
        pedidoBebidaData.push({
            "id": 0,
            "bebida": {"id": parseInt(item.id)},
            "pedido": pedido,
            "quantidade": item.quantidade
        })
    }
    salvarPedidoBebida(pedidoBebidaData)
}

function salvarPedidoBebida(pedidoBebidaData){
    pedidoBebidaData.forEach(pedidoBebida => {
        $.ajax({
            type: 'POST',
            url: 'https://deploy-planalto.onrender.com/PedidoBebida',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(pedidoBebida),
            success: function (data) {
                console.log('Pedido de bebida realizado com sucesso!')
            }
        })
    })

    document.getElementById('resumo-valor-total').innerHTML = '0.00'
    localStorage.removeItem('carrinho')
    window.location.reload()
}

function listarPedidoPorUsuario(id){

    fetch(`https://deploy-planalto.onrender.com/PedidoBebida/Pedido/${id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Limpa o tbody antes de adicionar novos pedidos
        document.getElementById("tbody-pedidos").innerHTML = '';

        for (const pedido of data) {

            var status = ''

            switch (pedido.statusPedido) {
                case 1:
                    status = 'Aguardando pagamento'
                    break;

                case 2:
                    status = 'Pago'
                    break;

                case 3:
                    status = 'Finalizado'
                    break;
            
                default:
                    break;
            }

            document.getElementById("tbody-pedidos").innerHTML += `
                <tr>
                    <th scope="row">${pedido.id}</th>
                    <td>${pedido.nome}</td>
                    <td>${formatarData(pedido.data)}</td>
                    <td>${(pedido.valorPedido).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td> ${pedido.brCode ? (pedido.brCode).substring(0, 15)+`... <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy copiarLink" style="cursor: pointer; color: #da5c5c;" data-dados="${pedido.brCode}" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                        </svg>` : '-'} 
                        
                    </td>
                    <td>${status}</td>
                </tr>
                
                `;
        }

        if(data.length == 0){
            document.getElementById("tbody-pedidos").innerHTML = `
                <tr>
                    <td colspan="5">Nenhum pedido encontrado</td>
                </tr>`;
        }
    })
}

$(document).on('click', '.copiarLink', function(){
    brcode = $(this).attr('data-dados');
    copyText(brcode);

    // var clipboard = new ClipboardJS('.copiarLink');

    // clipboard.on('success', function (e) {
    // e.clearSelection();

    // });
    // $.niftyNoty({
    //     type: 'mint',
    //     title: 'Json copiado!',
    //     container: 'floating',
    //     closeBtn: true,
    //     timer: 3000
    //     });

    // document.execCommand($(this).attr('data-urlFiador'))

});

function copyText(texto) {
    // var jsonIdentadoEnvio = JSON.stringify(JSON.parse(objetoDadosEnvio), null, 4);


    var $temp = $('<input id="valorCopiar" value="'+texto+'">');
    $("body").append($temp);
    $('#valorCopiar').val(texto).select();
    document.execCommand("copy");
    $temp.remove();
  }

function listarTodosPedidos(){
    fetch(`https://deploy-planalto.onrender.com/PedidoBebida/Pedido`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Limpa o tbody antes de adicionar novos pedidos
        document.getElementById("tbody-todosPedidos").innerHTML = '';

        for (const pedido of data) {
            console.log(pedido)
            document.getElementById("tbody-todosPedidos").innerHTML += `
                <tr>
                    <th scope="row">${pedido.id}</th>
                    <td>${pedido.nome}</td>
                    <td>${formatarData(pedido.data)}</td>
                    <td>${(pedido.valorPedido).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td>${pedido.nomeCliente}</td>
                    <td>${pedido.enderecoCliente}</td>
                    <td>
                        <select id="select_${pedido.id}" value="${pedido.statusPedido}" class="selectPedidoStatus">
                            <option value="1" ${pedido.statusPedido == 1 ? "selected" : ""}>Aguardando pagamento</option>
                            <option value="2" ${pedido.statusPedido == 2 ? "selected" : ""}>Pago</option>
                            <option value="3" ${pedido.statusPedido == 3 ? "selected" : ""}>Finalizado</option>
                        </select>
                    </td>
                </tr>`;
        }

        if(data.length == 0){
            document.getElementById("tbody-todosPedidos").innerHTML = `
                <tr>
                    <td colspan="7">Nenhum pedido encontrado</td>
                </tr>`;
        }
    })
}

function formatarData(data){
    //padrao dd-mm-yyyy
    var novaData = new Date(data)
    var dia = novaData.getDate()
    var mes = novaData.getMonth() + 1
    if(mes < 10){
        mes = "0" + mes
    }
    if(dia < 10){
        dia = "0" + dia
    }
    var ano = novaData.getFullYear()

    return `${dia}/${mes}/${ano}`
}

$(document).on('change', ".selectPedidoStatus", function(){

    salvarStatusPedido(this.id.split('_')[1], this.value)

})

function salvarStatusPedido(idPedido, status){
    $.ajax({
        type: 'PUT',
        url: 'https://deploy-planalto.onrender.com/Pedido/'+idPedido+'/'+status,
        success: function (data) {
            alert('Status do pedido alterado com sucesso!')
        }
    })
}

$(document).on('click', "#pedidosUsuario", function(){

    $("#rowPageContent").empty()

    $.ajax({
        url: `https://matvini0601.github.io/View/Pedidos/Pedidos.html`,
        type: "GET",
        success: function (data) {
            $("#pageContent #rowPageContent").append(data) 
            var idUsuario = localStorage.getItem("id")
            listarPedidoPorUsuario(idUsuario)
            
        }
    })


})

$(document).on('click', "#todosPedidos", function(){

    $("#rowPageContent").empty()

    $.ajax({
        url: `https://matvini0601.github.io/View/Pedidos/TodosPedidos.html`,
        type: "GET",
        success: function (data) {
            $("#pageContent #rowPageContent").append(data) 
            listarTodosPedidos()
        }
    })

})


$(document).on('click', "#incluirBebida", function(){

    $("#rowPageContent").empty()

    $.ajax({
        url: `https://matvini0601.github.io/View/Bebidas/IncluirBebida.html`,
        type: "GET",
        success: function (data) {
            $("#pageContent #rowPageContent").append(data) 
            //alert("Bebida incluída com sucesso!");
            
        }
    })

    loadCategorias()

})

$(document).on('click', "#incluirCategoria", function(){

    $("#rowPageContent").empty()

    $.ajax({
        url: `https://matvini0601.github.io/View/Categoria/IncluirCategoria.html`,
        type: "GET",
        success: function (data) {
            $("#pageContent #rowPageContent").append(data) 
            //alert("Bebida incluída com sucesso!");
        }
    })

})

$(document).on('click', "#alterarBebida", function(){

    $("#rowPageContent").empty()

    carregarBebidas()

})

$(document).on('click', "#alterarCategoria", function(){

    $("#rowPageContent").empty()

    $.ajax({
        url: `https://matvini0601.github.io/View/Categoria/Categoria.html`,
        type: "GET",
        success: function (data) {
            $("#pageContent #rowPageContent").append(data) 
            carregarCategorias()
        }
    })

})

$(document).on('click', ".btnAlterarBebida", function(){

    var idBebida = $(this).attr('data-id')

    $("#rowPageContent").empty()

    $.ajax({
        url: `https://matvini0601.github.io/View/Bebidas/IncluirBebida.html`,
        type: "GET",
        success: function (data) {
            retornarDetalhesBeida(idBebida)

            $("#pageContent #rowPageContent").append(data)
            console.log(data)             
        }
    })

})

$(document).on('click', ".btnAlterarCategoria", function(){

    var idCategoria = $(this).attr('data-id')

    $("#rowPageContent").empty()

    $.ajax({
        url: `https://matvini0601.github.io/View/Categoria/IncluirCategoria.html`,
        type: "GET",
        success: function (data) {
            retornarDetalhesCategoria(idCategoria)

            $("#pageContent #rowPageContent").append(data)
            console.log(data)             
        }
    })

})

$(document).on('click', "#salvarBebida", function(){

    var idBebida = document.getElementById("idBebida").value

    var bebidaData = {
        "id": idBebida == "" ? 0 : idBebida,
        "nome": document.getElementById("nomeBebida").value,
        "preco": document.getElementById("precoBebida").value.replace(',', '.'),
        "descricao": document.getElementById("descricaoBebida").value,
        "quantidade": document.getElementById("quantidadeBebida").value,
        "foto": $('#image-data').val(),
        "categoria": {"id": document.getElementById("selectCategoriaBebida").value,
                      "nome": $("#selectCategoriaBebida option[value='"+document.getElementById("selectCategoriaBebida").value+"']").text()
                     }
    }

    if(document.getElementById("selectCategoriaBebida").value == ''){
        alert('Selecione uma categoria!')
        return
    }

    if(idBebida == ""){
        $.ajax({
            type: 'POST',
            url: 'https://deploy-planalto.onrender.com/Bebida',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(bebidaData),
            success: function (data) {
                alert('Bebida incluída com sucesso!')
            }, complete: function(){
                $("#alterarBebida").trigger('click') 
            }
        })
    } else {
        $.ajax({
            type: 'PUT',
            url: 'https://deploy-planalto.onrender.com/Bebida/'+idBebida,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(bebidaData),
            success: function (data) {
                alert('Bebida alterada com sucesso!')
            }, complete: function(){
                $("#alterarBebida").trigger('click') 
            }
        })
    }

    

})

$(document).on('click', "#salvarCategoria", function(){

    var idCategoria = document.getElementById("idCategoria").value

    var categoriaData = {
        "id": idCategoria == "" ? 0 : idCategoria,
        "nome": document.getElementById("nomeCategoria").value
    }

    if(idCategoria == ""){
        $.ajax({
            type: 'POST',
            url: 'https://deploy-planalto.onrender.com/Categoria',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(categoriaData),
            success: function (data) {
                alert('Categoria incluída com sucesso!')
            }, complete: function(){
                $("#alterarCategoria").trigger('click') 
            }
        })
    } else {
        $.ajax({
            type: 'PUT',
            url: 'https://deploy-planalto.onrender.com/Categoria/'+idCategoria,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(categoriaData),
            success: function (data) {
                alert('Categoria alterada com sucesso!')
            }, complete: function(){
                $("#alterarCategoria").trigger('click') 
            }
        })
    }
})

$(document).on('click', "#sair", function(){

    localStorage.removeItem("id")
    localStorage.removeItem("nome")
    localStorage.removeItem("tipo")
    window.location.href = window.location.origin + "/View/Login/Login.html"
    
})

$(document).on('click', "#acessarDashboard", function(){
    //target blank
    window.open(window.location.origin + "/View/Dashboard/Dashboard.html", "_blank");
    
})

function carregarBebidas(){

    $.ajax({
        url: `https://deploy-planalto.onrender.com/Bebida`,
        type: "GET",
        success: function (data) {
            data.forEach(bebida => {
                // Constrói a tag img com o Base64 da bebida
                const fotoSrc = `data:image/png;base64,${bebida.foto}`;
    
                $('#rowPageContent').append(`
                    <div class="col-md-3">
                        <div id=card-` + bebida.id + ` class="cardAlterar">
                            <h4 class="order-card-title">` + bebida.nome + `</h4>
                            <img class="order-card-image" style='width: 100% !important; object-fit: cover; margin: 0px !important;' src="${fotoSrc}" alt="${bebida.nome}" />
                            <h4 class="order-card-price"><a>R$ </a><span id=preco-` + bebida.id + `>` + bebida.preco + `</span></h4>
                            <div class="order-card-description">
                                <h5 class=title-descricao>Descrição</h5>
                                <p class="descricao" title="` + bebida.descricao + `">` + bebida.descricao + `</p>
                                <div class="order-card-quantity">
                                    <button class="btn btn-success btnAlterarBebida" data-id=` + bebida.id + ` id=alterarBebida_${bebida.id} style="background-color: #da5c5c; width: 40%;">Alterar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            });
        }
    });

}

function retornarDetalhesBeida(idBebida){
    $.ajax({
        url: `https://deploy-planalto.onrender.com/Bebida/`+idBebida,
        type: "GET",
        success: function (data) {

            const fotoSrc = `data:image/png;base64,${data.foto}`;
            $('#image-data').text(data.foto)
            $('#image-data').val(data.foto)
            $('#product-container').append(`
                
                <img src='${fotoSrc}' class="product-image"></img>
                
            `)
            
            document.getElementById("idBebida").value = data.id
            document.getElementById("nomeBebida").value = data.nome
            document.getElementById("precoBebida").value = data.preco
            document.getElementById("descricaoBebida").value = data.descricao
            document.getElementById("quantidadeBebida").value = data.quantidade

            data.categoria.id ?? null ? loadCategorias(data.categoria.id) : 1
        }
    })
}

function retornarDetalhesCategoria(idCategoria){
    $.ajax({
        url: `https://deploy-planalto.onrender.com/Categoria/`+idCategoria,
        type: "GET",
        success: function (data) {
            document.getElementById("idCategoria").value = data.id
            document.getElementById("nomeCategoria").value = data.nome
        }
    })
}

function loadCategorias(id = null){

    $('#selectCategoriaBebida').empty()

    $.ajax({
        url: `https://deploy-planalto.onrender.com/Categoria`,
        type: "GET",
        success: function (data) {
            data.forEach(categoria => {

                if(id != null && categoria.id == id){
                    $('#selectCategoriaBebida').append(`
                        <option value=`+categoria.id+` selected>`+categoria.nome+`</option>
                    `)
                } else {
                    $('#selectCategoriaBebida').append(`
                        <option value=`+categoria.id+`>`+categoria.nome+`</option>
                    `)
                }                
            });
        }
    })
}

function carregarCategorias(){

    fetch(`https://deploy-planalto.onrender.com/Categoria`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Limpa o tbody antes de adicionar novos pedidos
        document.getElementById("tbody-categorias").innerHTML = '';

        for (const categoria of data) {
            document.getElementById("tbody-categorias").innerHTML += `
                <tr>
                    <th scope="row">${categoria.id}</th>
                    <td>${categoria.nome}</td>
                    <td><button class="btn btn-success btnAlterarCategoria" data-id=`+categoria.id+` id=alterarCategoria_${categoria.id} style="background-color: #da5c5c; width: 40%;">Alterar</button></td>
                </tr>`;
        }

        if(data.length == 0){
            document.getElementById("tbody-todosPedidos").innerHTML = `
                <tr>
                    <td colspan="4">Nenhum pedido encontrado</td>
                </tr>`;
        }
    })

}