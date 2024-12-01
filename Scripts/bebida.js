//const URL = "http://https://deploy-planalto.onrender.com/"

$(document).ready(function(){

    loadBebidas()

})

function loadBebidas(){
    $.ajax({
        url: `http://https://deploy-planalto.onrender.com//Bebida`,
        type: "GET",
        success: function (data) {
            $('#bebidas').empty()

            data.forEach(bebida => {

                const fotoSrc = `data:image/png;base64,${bebida.foto}`;

                $('#bebidas').append(`
                    <div class="col-md-3">
                        <div id=card-`+bebida.id+` class="card">
                            <h4 id=nome-`+bebida.id+` class="order-card-title">`+bebida.nome+`</h3>
                            <img id="foto-${bebida.id}" class="order-card-image" style='width: 100% !important; object-fit: cover; margin: 0px !important;'  src="${fotoSrc}" alt="${bebida.nome}" />
                            <h4 class="order-card-price"><a>R$ </a><span id=preco-`+bebida.id+`>`+bebida.preco+`</span></h4>
                            <div class="order-card-description">
                                <h5 class=title-descricao>Descrição</h3>
                                <p class="descricao" title="`+bebida.descricao+`">`+bebida.descricao+`</p>
                                <div class="order-card-quantity">
                                    <button class=botao-quantidade dataId=`+bebida.id+` id=remover>-</button>
                                    <span id=quantidade-`+bebida.id+`>0</span>
                                    <button class=botao-quantidade dataId=`+bebida.id+` id=adicionar>+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `)
            });
            
            if(data.length == 0){
                $('#bebidas').append(`
                    <div class="col-md-12">
                        <h3>Não há bebidas cadastradas</h3>
                    </div>
                `)
            }
        }
    })
}


//Product quantity handler
$(document).on('click', '#remover', function(){
    document.getElementById("resumo-valor-total").innerHTML.replace(",", ".")
    const id = this.getAttribute('dataId')
    var quantity = document.getElementById('quantidade-'+id).innerText
    var valorTotal = document.getElementById('resumo-valor-total').innerHTML

    console.log(quantity)
    if(quantity > 0){
        quantity -= 1

        if(quantity == 0){
            //resetar border do card caso não tenha adicionado quantidade
            document.getElementById("card-"+id).style.border = "solid 1px #e1e1e1"
        }
        valorTotal = parseFloat(document.getElementById('preco-'+id).innerText)
    }

    var valor = parseFloat(document.getElementById('resumo-valor-total').innerHTML) - (valorTotal).toFixed(2)

    //Atualizar visualização
    document.getElementById('quantidade-'+id).innerText = quantity
    document.getElementById('resumo-valor-total').innerHTML = valor.toFixed(2) 

    salvarCarrinho(id)
})

$(document).on('click', '#adicionar', function(){
    document.getElementById("resumo-valor-total").innerHTML.replace(",", ".")
    const id = this.getAttribute('dataId')
    var quantity = document.getElementById('quantidade-'+id).innerText
    var valorTotal = document.getElementById('resumo-valor-total').innerHTML

    quantity = parseInt(quantity) + 1
    valorTotal = parseFloat(document.getElementById("resumo-valor-total").innerHTML) + parseFloat(document.getElementById('preco-'+id).innerText)

    if(quantity > 0){
        //altera border do card para indicar que foi adicionado quantidade
        document.getElementById("card-"+id).style.border = "solid 2px green"
    }

    //Atualizar visualização
    document.getElementById('quantidade-'+id).innerText = quantity
    document.getElementById('resumo-valor-total').innerHTML = (valorTotal).toFixed(2)

    salvarCarrinho(id)
})

function salvarCarrinho(id){
    var quantidade = document.getElementById('quantidade-'+id).innerText
    var valorTotalProduto = parseFloat(document.getElementById('preco-'+id).innerHTML) * quantidade
    var nome = document.getElementById('nome-'+id).innerText
    var foto = document.getElementById('foto-'+id).src
    var carrinho = localStorage.getItem('carrinho') ? JSON.parse(localStorage.getItem('carrinho')) : []

    var itemExiste = localizarItemCarrinho(id)
   
    if(itemExiste.index != -1){
        itemExiste.produto.quantidade = quantidade
        itemExiste.produto.valorTotalProduto = valorTotalProduto
        itemExiste.produto.nomeProduto = nome
        itemExiste.produto.valorUnitario = valorTotalProduto / quantidade
        itemExiste.produto.id = id

        carrinho[itemExiste.index] = itemExiste.produto
    }else{
        carrinho.push({
            id: id,
            quantidade: quantidade,
            nomeProduto: nome,
            valorUnitario: valorTotalProduto / quantidade,
            valorTotalProduto: valorTotalProduto,
            fotoProduto: foto
        })
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho))
    console.log(carrinho)
}

function localizarItemCarrinho(id) {
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));
    var item = { index: -1, produto: null };

    if (!carrinho) {
        return item;
    }

    for (var index = 0; index < carrinho.length; index++) {
        if (carrinho[index].id == id) {
            item = { index: index, produto: carrinho[index] };
            break;
        }
    }
    return item;
}

$(document).on('click', '#irParaCarrinho', function(){

    var carrinho = JSON.parse(localStorage.getItem('carrinho'))

    if(carrinho){
        window.location.href = location.origin+"/View/Usuario/carrinhoUsuario.html"
    }else{
        alert("Adicione um produto ao carrinho")
    }
    
})

$('#choose-photo').on('click', function () {
    $('#file-input').click(); // Simula o clique no input de arquivo
});

$('#file-input').on('change', function (event) {
    $('#product-container').empty(); // Limpa o container de imagem
    debugger

    const file = event.target.files[0]; // Obtém o arquivo selecionado
    if (file) {
        const reader = new FileReader(); // Cria um leitor de arquivos

        // Quando o arquivo for carregado
        reader.onload = function (e) {
            const base64String = e.target.result.split(',')[1]; // Remove o prefixo "data:image/...;base64,"
            
            // Exibe a imagem
            const imgElement = $('<img>').attr('src', e.target.result).addClass('product-image');
            $('#product-container').html(imgElement); // Adiciona a imagem ao container
            
            // Mostra a string Base64 no textarea
            $('#image-data').val(base64String);
        };

        reader.readAsDataURL(file); // Lê o arquivo como Data URL
    }
});
