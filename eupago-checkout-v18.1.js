/* Effen Design — V18.1 — Eupago checkout */
(function(){
  const PAY_URL = "https://yildftvunxwbiwswdrye.supabase.co/functions/v1/eupago-payment";

  function esc(v){
    return String(v ?? "").replace(/[&<>"']/g, m => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[m] || m));
  }

  function getPaymentTotal(){
    return typeof orderTotal === "function" ? Number(orderTotal()) || 0 : 0;
  }

  function hasQuoteItems(){
    return (typeof cart !== "undefined" ? cart : []).some(item => {
      const p = (typeof products !== "undefined" ? products : []).find(y => y.id === item.id);
      const u = item.unitPrice ?? p?.price;
      return u === null || u === undefined;
    });
  }

  function injectPaymentUI(){
    const box = document.getElementById("reviewModal")?.querySelector(".modalbox");
    if(!box || document.getElementById("eupagoPaymentBox")) return;

    const actions = box.querySelector('.add[onclick="sendOrder()"]')?.parentElement;
    if(!actions) return;

    const el = document.createElement("div");
    el.id = "eupagoPaymentBox";
    el.style.cssText = "margin:14px 0 16px;padding:14px;border:1px solid rgba(230,184,55,.25);border-radius:8px;background:#151515;";
    el.innerHTML = `
      <div style="font:10px 'Space Mono';letter-spacing:1.5px;color:#e6b837;text-transform:uppercase;margin-bottom:8px">PAGAMENTO</div>
      <div style="color:#aaa;font-size:11px;line-height:1.5;margin-bottom:10px">Escolhe o método de pagamento para concluir a encomenda.</div>
      <select id="eupagoMethod" style="width:100%;background:#191919;border:1px solid rgba(255,255,255,.08);color:#fff;border-radius:5px;padding:11px;font-size:12px">
        <option value="">Selecionar método de pagamento</option>
        <option value="mbway">MB WAY</option>
        <option value="multibanco">Multibanco</option>
      </select>
      <div id="eupagoMethodHelp" style="color:#777;font-size:10px;line-height:1.5;margin-top:8px"></div>
      <div id="eupagoPaymentResult" style="display:none;margin-top:12px"></div>`;

    actions.parentNode.insertBefore(el, actions);

    document.getElementById("eupagoMethod").addEventListener("change", function(){
      const help = document.getElementById("eupagoMethodHelp");
      help.textContent = this.value === "mbway"
        ? "Usa o número de telemóvel português indicado nos dados da encomenda. O pedido será enviado para a app MB WAY."
        : this.value === "multibanco"
        ? "Será apresentada a entidade, referência e valor para pagamento."
        : "";
    });
  }

  function showPaymentResult(html){
    const el=document.getElementById("eupagoPaymentResult");
    if(el){el.style.display="block";el.innerHTML=html;}
  }

  function showPaymentBoxMessage(msg,ok){
    showPaymentResult(`<div style="padding:10px;border-radius:6px;background:${ok?"#15120a":"#190f0f"};border:1px solid ${ok?"rgba(230,184,55,.25)":"rgba(255,100,100,.25)"};color:${ok?"#ddd":"#ffaaaa"};font-size:11px;line-height:1.5">${esc(msg)}</div>`);
  }

  async function createPayment(reference,method,customerPhone){
    const response=await fetch(PAY_URL,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "apikey":SUPABASE_PUBLISHABLE_KEY
      },
      body:JSON.stringify({reference,method,customerPhone})
    });
    let result={};
    try{result=await response.json();}catch(e){}
    if(!response.ok) throw new Error(result?.error||"Não foi possível criar o pagamento.");
    return result;
  }

  async function v18SendOrder(){
    const c=window._orderCustomer, ref=window._orderReference;
    if(!c||!ref){
      alert("A referência da encomenda não está disponível. Volta atrás e revê a encomenda.");
      return;
    }

    injectPaymentUI();

    const total=getPaymentTotal();
    const quote=hasQuoteItems();
    const method=document.getElementById("eupagoMethod")?.value||"";

    if(!quote&&total<1){
      showPaymentBoxMessage("O valor mínimo para pagamento online é 1,00 €.",false);
      return;
    }

    if(!quote&&!method){
      showPaymentBoxMessage("Seleciona MB WAY ou Multibanco.",false);
      return;
    }

    const btn=document.querySelector('#reviewModal button[onclick="sendOrder()"]');
    if(btn){btn.disabled=true;btn.textContent="A PROCESSAR…";}

    const lines=[],uploaded=[];

    try{
      for(const item of cart){
        const f=window._effenFiles?.[item.key];

        if(f){
          const result=await v14UploadFile(f,ref);
          if(!result||result.localOnly) throw new Error("O ficheiro "+f.name+" não foi enviado para o armazenamento.");
          item.options=item.options||{};
          item.options.filePath=result.path;
          uploaded.push({name:result.name,path:result.path,size:result.size,type:result.type});
        }else if(item.options?.filePath){
          uploaded.push({
            name:item.options.file||"Ficheiro associado",
            path:item.options.filePath,
            size:null,
            type:null
          });
        }

        const p=products.find(y=>y.id===item.id);
        const u=item.unitPrice??p?.price??null;

        const d=item.options
          ? [
              item.options.size,
              item.options.color?"Cor: "+item.options.color:"",
              item.options.pos,
              item.options.print?"Estampagem: "+item.options.print:"",
              item.options.finish?"Acabamento: "+item.options.finish:"",
              item.options.text?"Texto: "+item.options.text:"",
              item.options.file?"Ficheiro: "+item.options.file:""
            ].filter(Boolean).join(" | ")
          : "";

        lines.push(`- ${p?.name||"Produto"} x${item.qty}${d?" — "+d:""}${u!==null?" — "+euro(u*item.qty):" — pedir orçamento"}`);
      }

      const supabaseOrder={
        reference:ref,
        customer_name:c.name||"",
        customer_phone:c.phone||"",
        customer_email:c.email||"",
        delivery:c.delivery||"",
        notes:c.notes||"",
        items:cart.map(item=>{
          const p=products.find(y=>y.id===item.id);
          return {
            id:item.id,
            name:p?.name||item.name||"",
            quantity:item.qty||1,
            price:item.unitPrice??p?.price??null,
            options:item.options||{}
          };
        }),
        uploads:uploaded,
        total:Number(total)||0,
        status:"Recebida",
        payment_method:quote?null:(method==="mbway"?"MB WAY":"Multibanco"),
        payment_status:quote?null:"Pending"
      };

      await v17SaveOrder(supabaseOrder);

      let payment=null;

      if(!quote){
        if(method==="mbway"){
          const phone=String(c.phone||"").replace(/\D/g,"");
          if(!/^9\d{8}$/.test(phone)){
            throw new Error("Indica um número de telemóvel português válido para MB WAY.");
          }
        }
        payment=await createPayment(ref,method,c.phone||"");
      }

      const order=createLocalOrder(cart,c,total);
      order.ref=ref;
      order.uploads=uploaded;
      order.status="Recebida";
      order.paymentMethod=quote?null:(method==="mbway"?"MB WAY":"Multibanco");
      order.paymentStatus=quote?null:"Pending";

      const orders=getOrders();
      const oi=orders.findIndex(o=>o.ref===order.ref);
      if(oi>=0){
        orders[oi]=order;
        saveOrders(orders);
      }

      localStorage.setItem("effen_last_order",JSON.stringify({
        reference:ref,
        createdAt:new Date().toISOString(),
        customer:c,
        cart:cart,
        total:total,
        uploads:uploaded,
        payment:payment
      }));

      if(quote){
        showPaymentResult(`<div style="padding:12px;border-radius:6px;background:#15120a;border:1px solid rgba(230,184,55,.25);color:#ddd;font-size:11px;line-height:1.6"><strong style="color:#e6b837">PEDIDO RECEBIDO</strong><br>Referência: <strong>${esc(ref)}</strong><br>Este pedido contém artigos sob orçamento. A Effen Design irá confirmar o valor final antes da produção.</div>`);
      }else if(method==="mbway"){
        showPaymentResult(`<div style="padding:12px;border-radius:6px;background:#15120a;border:1px solid rgba(230,184,55,.25);color:#ddd;font-size:11px;line-height:1.6"><strong style="color:#e6b837">MB WAY ENVIADO</strong><br>Referência: <strong>${esc(ref)}</strong><br>Valor: <strong>${euro(total)}</strong><br>Confirma o pedido na aplicação MB WAY. O pedido tem uma janela limitada para pagamento.</div>`);
      }else{
        const entity=payment?.entity||payment?.provider?.entidade||payment?.provider?.entity||"";
        const paymentReference=payment?.paymentReference||payment?.provider?.referencia||payment?.provider?.reference||"";

        showPaymentResult(`<div style="padding:12px;border-radius:6px;background:#15120a;border:1px solid rgba(230,184,55,.25);color:#ddd;font-size:11px;line-height:1.6"><strong style="color:#e6b837">REFERÊNCIA MULTIBANCO</strong><br>Entidade: <strong>${esc(entity||"—")}</strong><br>Referência: <strong>${esc(paymentReference||"—")}</strong><br>Valor: <strong>${euro(total)}</strong></div>`);
      }

      const msg=[
        "Olá! Quero fazer uma encomenda na Effen Design.",
        "",
        "REFERÊNCIA: "+ref,
        "",
        "CLIENTE",
        "Nome: "+c.name,
        "Telefone: "+c.phone,
        c.email?"Email: "+c.email:"",
        "Entrega: "+c.delivery,
        "",
        "PRODUTOS",
        lines.join("\n"),
        "",
        "Total dos produtos com preço definido: "+euro(total),
        !quote&&method?"Pagamento: "+(method==="mbway"?"MB WAY":"Multibanco"):"",
        !quote&&method==="multibanco"&&payment?"Entidade: "+(payment.entity||payment.provider?.entidade||""):"",
        !quote&&method==="multibanco"&&payment?"Referência: "+(payment.paymentReference||payment.provider?.referencia||""):"",
        c.notes?"Notas: "+c.notes:""
      ].filter(Boolean).join("\n");

      v14SetStatus(
        quote
          ? "Encomenda guardada. A abrir WhatsApp…"
          : "Pagamento criado. A abrir WhatsApp…",
        true
      );

      window.open("https://wa.me/351928372914?text="+encodeURIComponent(msg),"_blank");

    }catch(err){
      showPaymentBoxMessage(err?.message||"Não foi possível concluir a encomenda.",false);
      v14SetStatus("Não foi possível concluir a encomenda: "+(err?.message||err),false);
    }finally{
      if(btn){
        btn.disabled=false;
        btn.textContent="ENVIAR PEDIDO";
      }
    }
  }

  const originalReview=window.reviewOrder;

  window.reviewOrder=function(){
    if(typeof originalReview==="function") originalReview();

    setTimeout(()=>{
      injectPaymentUI();

      const box=document.getElementById("eupagoPaymentBox");
      const quote=hasQuoteItems();

      if(box&&quote){
        box.innerHTML=`
          <div style="font:10px 'Space Mono';letter-spacing:1.5px;color:#e6b837;text-transform:uppercase;margin-bottom:8px">PAGAMENTO</div>
          <div style="color:#aaa;font-size:11px;line-height:1.5">
            Este pedido contém artigos <strong style="color:#fff">sob orçamento</strong>.<br>
            O pagamento online ficará disponível depois de confirmarmos o valor final.
          </div>`;
      }
    },0);
  };

  window.sendOrder=v18SendOrder;
  document.addEventListener("DOMContentLoaded",injectPaymentUI);
})();