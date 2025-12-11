
module.exports = { transactionMailCatalouge, transactionMailCatalouge1 }

function transactionMailCatalouge(url,
    txnID,
    stellarPublicKey,
    employeeUserId,
    transactionAmount,
    orderAmount,
    home,
    happy,
    sad,
    lock,
    powered,
    current_time,
    ZoinLogo,
    product) {

    let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        
        <style>
            section.main-section_gizmo {
            background: #37516d;
            margin: 0;
            width: 100%;
            padding: 0;
            box-sizing: border-box;
        }
        .inner-gimzo {
            max-width: 500px;
            min-width: 218px;
            width: 100%;
            
            margin: auto;
            padding: 30px 0;
        }
        .key-gizmo {
            background: #fff;
            padding: 15px;
            border-radius: 10px 10px 0 0;
            /* display: flex;
            justify-content: space-between; */
        }
        img.homepng {
            width: 100%;
        }
        img.scan-img {
            width: 55px;
            height: 55px;
            /* margin-right: 0; */
            display: block;
            text-align: end;
            margin-left: auto;
        }
        .authorized-gizmo {
            /* display: flex;
            flex-direction: column; */
        }
        body {
            font-family: roboto;
            margin: 0px;
            /* padding: 15px; */
        }
        section.main-section_gizmo {
            background: #37516d;
            margin: 0;
            width: 100%;
            padding: 0 15px;
            box-sizing: border-box;
        }
        span.auth-gizmo {
            font-size: 20px;
            text-align: right;
            color: #2da0da;
            display: block;
        }
        .icons-gizmo {
            width: 85px;
        }
        .address-con {
            background: #fff;
            padding: 0 15px;
        }
        span.gizmo_cafe {
            display: block;
            color: #37516d;
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 10px;
        }
        span.adres20 ,span.adres201 {
            color: #919191;
            font-size: 13px;
            display: block;
            margin-bottom: 5px;
        }
        .key-pass-gizmo {
            margin: 10px 0;
            margin-bottom: 0px;
            width: 100%;
            /* white-space: nowrap; */
            display: block;
        }
        span.key_no {
            color: #37516d;
            font-size: 20px;
            display: inline-block;
        }
        .emplyee-id {
            background: #fff;
            padding: 0 15px;
            border-top: 5px solid #2da0da;
            border-radius: 0 0 10px 10px;
        }
        span.con-date {
            display: block;
            color: #37516d;
            font-size: 13px;
            font-weight: 600;
            margin-top: 20px;
        }
        span.con-id {
            display: block;
            font-size: 13px;
            margin-top: 6px;
            margin-bottom: 20px;
            font-weight: 400;
            color: #37516d;
        }
        span.two-child {
            /* display: flex;
            justify-content: space-between; */
        }
        span.subtotl {
            font-size: 15px;
            color: #37516d;
            font-weight: 400;
            margin-bottom: 10px;
        }
        span.blue-line {
            display: block;
            border-top: 1px solid #0000002b;
            padding: 1px 0;
            margin-top: 10px;
        }
        span.subtotl.total-max {
            font-size: 22px;
            font-weight: 500;
        }
        span.card-customer1 {
            font-size: 15px;
            color: #37516d;
        }
        img.visa-img {
            width: 20px;
        }
        span.responsive-con, span.rseponsive-aprrove {
            color: #919191;
            font-size: 13px;
            display: block;
            /* width: 138px; */
            margin-bottom: 5px;
        }
        span.two-child-div {
            /* display: flex;
            justify-content: space-between; */
        }
        span.rseponsive-aprrove.rseponsive-aprrove1 {
            /* display: flex;
            flex-direction: column; */
        }
        span.two-child-div>span:nth-child(1) {
           width: 50%;
        }
        span.two-child-div>span:nth-child(2) {
          width: 50%;
        }
        .experincewas, .privacy-con {
            background: #fff;
            /* border-top: 1px dashed #37516d; */
            border-radius: 10px 10px 10px 10px;
            padding:  15px;
        }
        span.experince {
            font-weight: 600;
            text-align: center;
            display: block;
            color: #37516d;
            padding: 14px 0;
        }
        span.smile-img>img {
            width: 55px;
            margin: 0 10px;
        }
        span.smile-img {
            /* display: flex;
            justify-content: center; */
        }
        span.privacy-receipt {
            color: #91919191;
            font-size: 11px;
        }
        span.unsscribe>a {
            margin: 10px 0;
            display: block;
            font-size: 13px;
            color: #919191;
        }
        a.col-10 {
            color: blue;
        }
        img.lock {
            width: 8px;
        }
        
        span.powered {
            /* display: flex;
            justify-content: start;
            align-items: flex-start; */
            color: #fff;
            font-size: 11px;
            margin: 10px 0;
        }
        img.pow {
            width: 132px;
            margin-left: 7px;
        }
        span.powered {
            width: 22px;
            white-space: nowrap;
        }
        .tablesection {
            background: #37516d;
            margin: 0;
            width: 100%;
            padding: 0 15px;
            box-sizing: border-box;
        }
        .inner-table {
            max-width: 545px;
            min-width: 218px;
            width: 100%;
            margin: auto;
            padding: 30px 0;
        }
        table {
            padding: 15px;
            background: #fff;
            border-radius: 10px;
        }
        span.approved-text,span.approved-text1 {
            display: block;
            /* width: 264px; */
            color: #919191;
            font-size: 13px;
        }
        table {
            padding: 15px;
            background: #fff;
            border-radius: 10px;
            width: 100%;
        }
        span.smile-img {
            margin: auto;
            display: block;
            width: 100%;
            text-align: center;
        }
        table.table22 {
            border-top: 1px dashed #37516d;
            border-bottom: 1px dashed #37516d;
        }
        table.table-last {
            background: #ff000000;
        }
        .blue-lines {
            width: 100%;
            background: red;
            border: 2px solid #2da0dc;
        }
        .logo_companies {
            width: 100px;
        }
        img.logo_companies_img {
            width: 100%;
        }
        .logo_companies {
            width: 82%;
            
        }
        </style>
        </head>
        <body>
           <div class="tablesection">
               <div class="inner-table">
                    <table>
              
                <tr>
                  <td style="width: 33%;"> 
                      <div class="icons-gizmo">
                        <img class="logo_companies_img" src="${ZoinLogo}" alt="">
                           <img class="homepng" src="${home}" alt="icon_shop">
                          
                     </div>
                   
                  </td>
                  <td></td>
                  <td style="width: 33%;">   <div class="authorized-gizmo">
                    <span class="auth-gizmo">Authorized</span>
                    <img class="scan-img"  src="${url}" alt="scan-img">
                    
                </div></td>
                
                 
                </tr>
        
                <tr>
                    <td  colspan="3"> 
                        <span class="gizmo_cafe ">Gizmo cafe 71</span>
                    </td>
                  
                </tr>
                <tr>
                  <td  colspan="3" style="width: 100%;"> 
                        <span class="adres20">(593) 858-2523</span>
                    </td>
                 </tr>
                 <tr>
                    <td  colspan="3" style="width: 100%;"> 
                        <span class="adres201">1458 Business Drive, Suite 946, Palo Alto, CA</span>
                      </td>
                   </tr>
                 
                  <tr>
                      <td  colspan="3" style="width:100% ;">
                        <div class="key-pass-gizmo">
                        <span class="key_no">${stellarPublicKey}</span>
                        </div>
                      </td>
                  </tr>`
    html += `<tr><td style="width:33%;"><span class="subtotl">Product Name</span></td>
                  <td style="width:33%;"><span class="subtotl"> Quantity</span></td> <td style="width:33%; text-align: end;">    <span class="subtotl">Total Amount</span></td><tr>`
    for (let i = 0; i < product.length; i++) {
        html += `<tr><td style="width:33%;">   <span class="subtotl">${product[i].name}</span></td>
                    <td style="width:33%;"><span class="subtotl">${product[i].quantity}</span></td>
                    <td style="text-align: end; width:30%;">    <span class="subtotl">$${product[i].totalAmount}</span></td><tr>`
    }
    //   html+=`</tr>`
    html += `<tr><td  colspan="3" style="width:100% ;"><div class="blue-lines"></div></td></tr>
                  <tr><td  colspan="3" style="width: 100%;">      <span class="con-date">${current_time}</span></td></tr>
                  <tr><td  colspan="3" style="width: 100%;">      <span class="con-id">Employee:  ${employeeUserId}</span></td></tr>
                  <tr>
                      <td>   <span class="subtotl">Subtotal</span></td>
                      <td></td>
                      <td style="text-align: end;">    <span class="subtotl">$${orderAmount}</span></td>
                  </tr>
                  <tr>
                    <td>   <span class="subtotl">Tip</span></td>
                    <td></td>
                    <td  style="text-align: end;">   <span class="subtotl">$0.00</span></td>
                </tr>
                <tr><td  colspan="3" style="width: 100%;">   <span class="blue-line"></span></td></tr>
                <tr>
                    <td>     <span class="subtotl">Total</span></td>
                    <td></td>
                    <td  style="text-align: end;">     <span class="subtotl total-max">$${transactionAmount}</span></td>
                </tr>
                <tr>
                    <td  colspan="3">Card customer
                        <img class="visa-img" src="visa.png" alt="">  4242</span></td>
                </tr>
                <tr><td  colspan="3">    <span class="responsive-con">Txn Type: AUTHORIZE</span></td></tr>
                <tr><td style="width: 50%;"> <span class="rseponsive-aprrove">Response: APPROVED</span></td>
                <td></td>
                <td style="width: 50%;">
                    <span class="approved-text">Approval Code: 170968Auth</span>
                    <span class="approved-text1">Txn ID: ${txnID}</span>
                </td></tr>
                <tr><td> <span class="rseponsive-aprrove">Auth Mode: ISSUER</span></td>
                <td></td>  
                <td>
                        
                        <span class="rseponsive-aprrove rseponsive-aprrove1  rseponsive-aprrove3">
                            43c803b0ac
                        </span>
                    </td></tr>
                    <tr><td>    <span class="rseponsive-aprrove">Type: CREDIT</span></td>
                    <td></td> <td>
                            
                            <span class="rseponsive-aprrove rseponsive-aprrove1  rseponsive-aprrove3">
                                Card Type: VISA
                            </span>
                        </td></tr>
                        <tr><td>     <span class="rseponsive-aprrove">Batch Number: 1</span></td>
                        <td></td><td>
                                
                                <span class="rseponsive-aprrove rseponsive-aprrove1  rseponsive-aprrove3">
                                    Entry Mode: KEYED
                                </span>
                            </td></tr>
            
        
               
              </table>
              <table class="table22">
                  <tr><td>
                    <span class="experince">How was your experience?</span>
                  </td></tr>
                  <tr><td>
                    <span class="smile-img">
                        <img class="sadimg"  src="${sad}" alt="">
                        <img class="happy-img" src="${happy}" alt="">
                    </span>
                  </td></tr>
              </table>
              <table>
                  <tr><td>
                    <div class="privacy-con">
                        <span class="privacy-receipt">This receipt from Gizmo Cafe 71 was sent by Poynt. If you have
                             any questions about the specific transaction, please contact the
                              merchant. If you feel you received this receipt in error please 
                              contact<a class="col-10"> support@poynt.com</a>. For our privacy policy info, go to<a class="col-10"> poynt.com/privacy</a></span>
                              <span class="unsscribe"><a href="#">Unsubscribe from receipt emails</a></span>
                    </div>
                  </td></tr>
              </table>
              <table class="table-last">
                  <tr>
                      <td>  <span class="powered"><img class="lock" src="${lock}" alt="">
                        Powered by<img class="pow" src="${powered}" alt="">
                    </span></td>
                  </tr>
              </table>
               </div>
           </div>
        </body>
        </html>`

    return html;

}


function transactionMailCatalouge1(url,
    txnID,
    stellarPublicKey,
    employeeUserId,
    transactionAmount,
    orderAmount,
    home,
    happy,
    sad,
    lock,
    powered,
    current_time,
    ZoinLogo,
    product) {
        let amountTax =[];
        let amount =[];
        let numOr0 = n => isNaN(n) ? 0 : n
        for(let i=0; i< product.length; i++){
            console.log(product[i]);
            amount[i]= numOr0(product[i].totalAmount);
            for(let j=0; j< product[i].taxFinals.length;j++){
                if(numOr0(product[i].taxFinals[j].taxAmount)){
                    if(amountTax[i]){
                        amountTax[i] += product[i].taxFinals[j].taxAmount;
                    }else{
                        amountTax[i] = product[i].taxFinals[j].taxAmount;
                    }
                }
            }
        }
        const totalAmount = amount.reduce((a,b)=> numOr0(a) +numOr0(b))
         const totalTax =   amountTax.reduce((a, b) => 
              numOr0(a) + numOr0(b))
         const avgTax = totalTax/amountTax.length;
         console.log(avgTax)

    let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        
        <style>
            section.main-section_gizmo {
            background: #37516d;
            margin: 0;
            width: 100%;
            padding: 0;
            box-sizing: border-box;
        }
        .inner-gimzo {
            max-width: 500px;
            min-width: 218px;
            width: 100%;
            
            margin: auto;
            padding: 30px 0;
        }
        .key-gizmo {
            background: #fff;
            padding: 15px;
            border-radius: 10px 10px 0 0;
            /* display: flex;
            justify-content: space-between; */
        }
        img.homepng {
            width: 100%;
        }
        img.scan-img {
            width: 55px;
            height: 55px;
            /* margin-right: 0; */
            display: block;
            text-align: end;
            margin-left: auto;
        }
        .authorized-gizmo {
            /* display: flex;
            flex-direction: column; */
        }
        body {
            font-family: roboto;
            margin: 0px;
            /* padding: 15px; */
        }
        section.main-section_gizmo {
            background: #37516d;
            margin: 0;
            width: 100%;
            padding: 0 15px;
            box-sizing: border-box;
        }
        span.auth-gizmo {
            font-size: 20px;
            text-align: right;
            color: #2da0da;
            display: block;
        }
        .icons-gizmo {
            width: 85px;
        }
        .address-con {
            background: #fff;
            padding: 0 15px;
        }
        span.gizmo_cafe {
            display: block;
            color: #37516d;
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 10px;
        }
        span.adres20 ,span.adres201 {
            color: #919191;
            font-size: 13px;
            display: block;
            margin-bottom: 5px;
        }
        .key-pass-gizmo {
            margin: 10px 0;
            margin-bottom: 0px;
            width: 100%;
            /* white-space: nowrap; */
            display: block;
        }
        span.key_no {
            color: #37516d;
            font-size: 20px;
            display: inline-block;
        }
        .emplyee-id {
            background: #fff;
            padding: 0 15px;
            border-top: 5px solid #2da0da;
            border-radius: 0 0 10px 10px;
        }
        span.con-date {
            display: block;
            color: #37516d;
            font-size: 13px;
            font-weight: 600;
            margin-top: 20px;
        }
        span.con-id {
            display: block;
            font-size: 13px;
            margin-top: 6px;
            margin-bottom: 20px;
            font-weight: 400;
            color: #37516d;
        }
        span.two-child {
            /* display: flex;
            justify-content: space-between; */
        }
        span.subtotl {
            font-size: 15px;
            color: #37516d;
            font-weight: 400;
            margin-bottom: 10px;
        }
        span.blue-line {
            display: block;
            border-top: 1px solid #0000002b;
            padding: 1px 0;
            margin-top: 10px;
        }
        span.subtotl.total-max {
            font-size: 22px;
            font-weight: 500;
        }
        span.card-customer1 {
            font-size: 15px;
            color: #37516d;
        }
        img.visa-img {
            width: 20px;
        }
        span.responsive-con, span.rseponsive-aprrove {
            color: #919191;
            font-size: 13px;
            display: block;
            /* width: 138px; */
            margin-bottom: 5px;
        }
        span.two-child-div {
            /* display: flex;
            justify-content: space-between; */
        }
        span.rseponsive-aprrove.rseponsive-aprrove1 {
            /* display: flex;
            flex-direction: column; */
        }
        span.two-child-div>span:nth-child(1) {
           width: 50%;
        }
        span.two-child-div>span:nth-child(2) {
          width: 50%;
        }
        .experincewas, .privacy-con {
            background: #fff;
            /* border-top: 1px dashed #37516d; */
            border-radius: 10px 10px 10px 10px;
            padding:  15px;
        }
        span.experince {
            font-weight: 600;
            text-align: center;
            display: block;
            color: #37516d;
            padding: 14px 0;
        }
        span.smile-img>img {
            width: 55px;
            margin: 0 10px;
        }
        span.smile-img {
            /* display: flex;
            justify-content: center; */
        }
        span.privacy-receipt {
            color: #91919191;
            font-size: 11px;
        }
        span.unsscribe>a {
            margin: 10px 0;
            display: block;
            font-size: 13px;
            color: #919191;
        }
        a.col-10 {
            color: blue;
        }
        img.lock {
            width: 8px;
        }
        
        span.powered {
            /* display: flex;
            justify-content: start;
            align-items: flex-start; */
            color: #fff;
            font-size: 11px;
            margin: 10px 0;
        }
        img.pow {
            width: 132px;
            margin-left: 7px;
        }
        span.powered {
            width: 22px;
            white-space: nowrap;
        }
        .tablesection {
            background: #37516d;
            margin: 0;
            width: 100%;
            padding: 0 15px;
            box-sizing: border-box;
        }
        .inner-table {
            max-width: 545px;
            min-width: 218px;
            width: 100%;
            margin: auto;
            padding: 30px 0;
        }
        table {
            padding: 15px;
            background: #fff;
            border-radius: 10px;
        }
        span.approved-text,span.approved-text1 {
            display: block;
            /* width: 264px; */
            color: #919191;
            font-size: 13px;
        }
        table {
            padding: 15px;
            background: #fff;
            border-radius: 10px;
            width: 100%;
        }
        span.smile-img {
            margin: auto;
            display: block;
            width: 100%;
            text-align: center;
        }
        table.table22 {
            border-top: 1px dashed #37516d;
            border-bottom: 1px dashed #37516d;
        }
        table.table-last {
            background: #ff000000;
        }
        .blue-lines {
            width: 100%;
            background: red;
            border: 2px solid #2da0dc;
        }
        .logo_companies {
            width: 100px;
        }
        img.logo_companies_img {
            width: 100%;
        }
        .logo_companies {
            width: 82%;
            
        }
        </style>
        </head>
        <body>
           <div class="tablesection">
               <div class="inner-table">
                    <table>
              
                <tr>
                  <td style="width: 33%;"> 
                      <div class="icons-gizmo">
                        <img class="logo_companies_img" src="${ZoinLogo}" alt="">
                           <img class="homepng" src="${home}" alt="icon_shop">
                          
                     </div>
                   
                  </td>
                  <td></td>
                  <td style="width: 33%;">   <div class="authorized-gizmo">
                    <span class="auth-gizmo">Authorized</span>
                    <img class="scan-img"  src="${url}" alt="scan-img">
                    
                </div></td>
                
                 
                </tr>
        
                <tr>
                    <td  colspan="3"> 
                        <span class="gizmo_cafe ">Gizmo cafe 71</span>
                    </td>
                  
                </tr>
                <tr>
                  <td  colspan="3" style="width: 100%;"> 
                        <span class="adres20">(593) 858-2523</span>
                    </td>
                 </tr>
                 <tr>
                    <td  colspan="3" style="width: 100%;"> 
                        <span class="adres201">1458 Business Drive, Suite 946, Palo Alto, CA</span>
                      </td>
                   </tr>
                 
                  <tr>
                      <td  colspan="3" style="width:100% ;">
                        <div class="key-pass-gizmo">
                        <span class="key_no">${stellarPublicKey}</span>
                        </div>
                      </td>
                  </tr>`
    html += `<tr><td style="width:33%;"><span class="subtotl">Product Name</span></td>
                  <td style="width:33%;"><span class="subtotl"> Quantity</span></td> <td style="width:33%; text-align: end;">    <span class="subtotl">Total Amount</span></td><tr>`
    for (let i = 0; i < product.length; i++) {
        html += `<tr><td style="width:33%;">   <span class="subtotl">${product[i].name}</span></td>
                    <td style="width:33%;"><span class="subtotl">${product[i].quantity}</span></td>
                    <td style="text-align: end; width:30%;">    <span class="subtotl">$${product[i].totalAmount}</span></td><tr>`
    }
    //   html+=`</tr>`
    html += `<tr><td  colspan="3" style="width:100% ;"><div class="blue-lines"></div></td></tr>`

               html +=  `<tr><td  colspan="3" style="width: 100%;">      <span class="con-date">${current_time}</span></td></tr>
                  <tr><td  colspan="3" style="width: 100%;">      <span class="con-id">Employee:  ${employeeUserId}</span></td></tr>
                  <tr>
                  <td>   <span class="subtotl">Tax</span></td>
                  <td></td>
                  <td style="text-align: end;">    <span class="subtotl">${avgTax}%</span></td>
              </tr>
                  <tr>
                      <td>   <span class="subtotl">Subtotal</span></td>
                      <td></td>
                      <td style="text-align: end;">    <span class="subtotl">$${totalAmount}</span></td>
                  </tr>
                  <tr>
                    <td>   <span class="subtotl">Tip</span></td>
                    <td></td>
                    <td  style="text-align: end;">   <span class="subtotl">$0.00</span></td>
                </tr>
                <tr><td  colspan="3" style="width: 100%;">   <span class="blue-line"></span></td></tr>
                <tr>
                    <td>     <span class="subtotl">Total</span></td>
                    <td></td>
                    <td  style="text-align: end;">     <span class="subtotl total-max">$${transactionAmount}</span></td>
                </tr>
                <tr>
                    <td  colspan="3">Card customer
                        <img class="visa-img" src="visa.png" alt="">  4242</span></td>
                </tr>
                <tr><td  colspan="3">    <span class="responsive-con">Txn Type: AUTHORIZE</span></td></tr>
                <tr><td style="width: 50%;"> <span class="rseponsive-aprrove">Response: APPROVED</span></td>
                <td></td>
                <td style="width: 50%;">
                    <span class="approved-text">Approval Code: 170968Auth</span>
                    <span class="approved-text1">Txn ID: ${txnID}</span>
                </td></tr>
                <tr><td> <span class="rseponsive-aprrove">Auth Mode: ISSUER</span></td>
                <td></td>  
                <td>
                        
                        <span class="rseponsive-aprrove rseponsive-aprrove1  rseponsive-aprrove3">
                            43c803b0ac
                        </span>
                    </td></tr>
                    <tr><td>    <span class="rseponsive-aprrove">Type: CREDIT</span></td>
                    <td></td> <td>
                            
                            <span class="rseponsive-aprrove rseponsive-aprrove1  rseponsive-aprrove3">
                                Card Type: VISA
                            </span>
                        </td></tr>
                        <tr><td>     <span class="rseponsive-aprrove">Batch Number: 1</span></td>
                        <td></td><td>
                                
                                <span class="rseponsive-aprrove rseponsive-aprrove1  rseponsive-aprrove3">
                                    Entry Mode: KEYED
                                </span>
                            </td></tr>
            
        
               
              </table>
              <table class="table22">
                  <tr><td>
                    <span class="experince">How was your experience?</span>
                  </td></tr>
                  <tr><td>
                    <span class="smile-img">
                        <img class="sadimg"  src="${sad}" alt="">
                        <img class="happy-img" src="${happy}" alt="">
                    </span>
                  </td></tr>
              </table>
              <table>
                  <tr><td>
                    <div class="privacy-con">
                        <span class="privacy-receipt">This receipt from Gizmo Cafe 71 was sent by Poynt. If you have
                             any questions about the specific transaction, please contact the
                              merchant. If you feel you received this receipt in error please 
                              contact<a class="col-10"> support@poynt.com</a>. For our privacy policy info, go to<a class="col-10"> poynt.com/privacy</a></span>
                              <span class="unsscribe"><a href="#">Unsubscribe from receipt emails</a></span>
                    </div>
                  </td></tr>
              </table>
              <table class="table-last">
                  <tr>
                      <td>  <span class="powered"><img class="lock" src="${lock}" alt="">
                        Powered by<img class="pow" src="${powered}" alt="">
                    </span></td>
                  </tr>
              </table>
               </div>
           </div>
        </body>
        </html>`

    return html;

}