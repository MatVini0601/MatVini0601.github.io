const express = require('express')
const app = express();

const Armas = [
    {nome:"M4A1", imagens:"https://www.airsoftgi.com/images/pic-007-cst-jg-m4-B.jpg", descricao:"A M4 é uma carabina alimentada com carregador, operado à gás por impacto direto, refrigerado a ar, 5.56×45mm NATO. Tem um cano de 14,5 in e uma mira telescópica.", peso:"2,95 kg", material:"Metal", preco:"3.400,21"},
    {nome:"AR15", imagens:"https://d1bh8ymjsytgwi.cloudfront.net/Custom/Content/Products/10/31/rifle-de-airsoft-aeg-m4-ar15-neptune-10-%E2%80%93-rossi-l1.jpg", descricao:"Um fuzil estilo AR-15 é um fuzil semiautomático leve baseado no projeto Colt AR-15.", peso:"2,27 kg–3,9 kg", material:"Metal", preco:"3.100,65"},
    {nome:"416", imagens:"https://airsofts.com.br/wp-content/uploads/2019/10/Hk416-Rifle-Airsoft-EVO-AEG-HK416D-Preto-1.jpg", descricao:"O HK416 é um fuzil de assalto fabricado pela Heckler & Koch GmbH. E também projetada por ela desde o início, para ser uma versão melhorada da carabina M4.", peso:"2,95 kg", material:"Metal", preco:"2.800,54"},
    {nome:"UMP45", imagens:"https://d1qejy7034t4b2.cloudfront.net/Custom/Content/Products/27/77/airsoft-ump-h-k-rifle-aeg-eletrica-umarex-m1.jpg", descricao:"A UMP é uma submetralhadora desenvolvida e fabricada pela empresa alemã Heckler & Koch.", peso:"2,3 kg - 2,65 kg", material:"Metal", preco:"1.200,62"},
    {nome:"AK12", imagens:"https://www.airsoftgi.com/images/LCT-LCK12-AK-12-B.jpg", descricao:"O AK-12 é um fuzil de assalto 5.45×39mm russo, projetado e fabricado pela Kalashnikov Concern. É o mais novo rifles de assalto derivado da série Padrão AK.", peso:"3.3 kg", material:"Metal", preco:"2.000,37"},
    {nome:"M32", imagens:"https://cdn.shopify.com/s/files/1/1446/3102/products/50195-000_1400x.jpg?v=1569023893", descricao:"O Milkor MGL (Multiple Grenade Launcher, ou Lançador Múltiplo de Granadas) é um lança-granadas de 40 mm (com variações de fogo de 37/38mm) com alcance de 400 metros, desenvolvido e fabricado na África do Sul pela empresa Milkor (Pty) Ltd.", peso:"5,3 kg", material:"Metal", preco:"780,24"},
    {nome:"M16", imagens:"https://d1qejy7034t4b2.cloudfront.net/Custom/Content/Products/15/81/rifle-aeg-airsoft-a-k-m16-a3-combo-sportline-calibre-6mm-l1.jpg", descricao:"O M16, oficialmente designado Rifle, Caliber 5.56 mm, M16, é uma família de fuzis militares adaptados do ArmaLite AR-15 para as forças armadas norte-americanas.", peso:"3,99 kg", material:"Metal", preco:"1.500,99"},
    {nome:"M82A1", imagens:"https://vignette.wikia.nocookie.net/military/images/1/15/Barrett_M82A1_Main_A.jpg/revision/latest/scale-to-width-down/340?cb=20110214012318", descricao:"Barrett M82 é um fuzil de precisão que dispara um projétil de grosso calibre (.50 BMG, com 12,7 mm de diâmetro). Foi desenvolvido a pedido do Exército Norte-Americano, que desejava um fuzil preciso e com alto poder de destruição, para cumprir o papel de arma antimaterial", peso:"13.5 kg", material:"Metal", preco:"2.767,73"},
    {nome:"NTW20", imagens:"https://www.military-today.com/firearms/ntw_20.jpg", descricao:"O NTW-20 é um rifle antimaterial sul-africano, desenvolvido Denel Mechem em 1990.", peso:"31 kg", material:"Metal", preco:"3.000,37"},
    {nome:"G36C", imagens:"https://d1qejy7034t4b2.cloudfront.net/Custom/Content/Products/47/18/rifle-de-airsoft-aeg-g36c-cm011-cyma-m7.jpg", descricao:"O G36 é um fuzil calibre 5.56x45mm NATO alemão, projetado no início dos anos 1990 pelos engenheiros da Heckler & Koch GmbH.", peso:"2.82 kg", material:"Metal", preco:"1.231,12"},
    {nome:"G11", imagens:"https://sabage-archive.com/wp-content/uploads/2018/02/0840_00.jpg", descricao:"O Heckler & Koch G11 é um prototipo de rifle de assalto desenvolvido durante 1960, 1970 and 1980 pela Gesellschaft für Hülsenlose Gewehrsysteme (GSHG)", peso:"4.3 kg", material:"Metal", preco:"1.320,44"},
    {nome:"AN94", imagens:"https://upload.wikimedia.org/wikipedia/commons/2/2f/Rifle_AN-94.jpg", descricao:"O AN-94 é um fuzil de assalto avançado russo. As iniciais para Avtomat Nikonova modelo 1994; O AN-94 foi considerado o sucessor do lendário Kalashnikov.", peso:"3.85 kg", material:"Metal", preco:"1.960,52"}
]

app.get("/armas", (req, res) =>{
    res.json(Armas)
})

app.post("/armas", (req, res) => {
    try {
        const arma = req.body
        Armas.push(arma)
        res.statusCode(201)
        return
    } catch (error) {
        console.log(error)
    }
    res.statusCode(400)
   
})

app.listen(process.env.PORT || 3000)