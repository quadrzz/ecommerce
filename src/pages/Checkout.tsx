import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, CheckCircle, MapPin, Send } from "lucide-react";

const WHATSAPP_NUMBER = "5581991169932";

const applyPhoneMask = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const applyCpfMask = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const applyCnpjMask = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
};

const applyCepMask = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const Checkout = () => {
  const { items, cartTotal, coupon, discount } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    documentType: "cpf" as "cpf" | "cnpj",
    cep: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCepLookup = async (cep: string) => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          address: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        }));
      }
    } catch {
      // CEP lookup failed silently
    }
  };

  const handleCepChange = (value: string) => {
    const formatted = applyCepMask(value);
    handleInputChange("cep", formatted);

    if (formatted.replace(/\D/g, "").length === 8) {
      handleCepLookup(formatted);
    }
  };

  const handleDocumentChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const type = digits.length > 11 ? "cnpj" : "cpf";
    const formatted = type === "cnpj" ? applyCnpjMask(value) : applyCpfMask(value);
    handleInputChange("document", formatted);
    setFormData((prev) => ({ ...prev, documentType: type as "cpf" | "cnpj" }));
  };

  const finalTotal = cartTotal - discount;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ["name", "email", "phone", "document", "cep", "address", "neighborhood", "city", "state", "number"];
    const emptyField = requiredFields.find(f => !formData[f as keyof typeof formData]);
    if (emptyField) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const { data: order, error: orderError } = await (supabase
        .from("orders" as any)
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_cpf: formData.document,
          zip_code: formData.cep,
          address: formData.address,
          address_number: formData.number,
          address_complement: formData.complement,
          address_neighborhood: formData.neighborhood,
          address_city: formData.city,
          address_state: formData.state,
          total_amount: finalTotal,
          coupon_code: coupon?.code || null,
          discount_amount: discount,
          status: "pending",
          payment_method: "whatsapp"
        })
        .select()
        .single() as any);

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        image_url: item.image,
      }));

      const { error: itemsError } = await (supabase
        .from("order_items" as any)
        .insert(orderItems) as any);

      if (itemsError) throw itemsError;

      const itemsList = items.map(item => 
        `• ${item.name} (${item.size}, ${item.material}) - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`
      ).join('%0A');

      const message = `*NOVO PEDIDO #${order.id.slice(0, 8)}*%0A%0A` +
        `*CLIENTE:* ${formData.name}%0A` +
        `*EMAIL:* ${formData.email}%0A` +
        `*WHATSAPP:* ${formData.phone}%0A` +
        `*CPF:* ${formData.document}%0A%0A` +
        `*ENDEREÇO:*%0A` +
        `${formData.address}, ${formData.number}${formData.complement ? ', ' + formData.complement : ''}%0A` +
        `${formData.neighborhood} - ${formData.city}/${formData.state}%0A` +
        `CEP: ${formData.cep}%0A%0A` +
        `*ITENS:*%0A${itemsList}%0A%0A` +
        `*Subtotal:* R$ ${cartTotal.toFixed(2)}%0A` +
        `${coupon ? `*Desconto (${coupon.code}):* -R$ ${discount.toFixed(2)}%0A` : ''}` +
        `*TOTAL:* R$ ${finalTotal.toFixed(2)}%0A%0A` +
        `_Pedido realizado via site_`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      
      toast.success("Pedido criado! Redirecionando para o WhatsApp...");
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        window.location.href = "/order-success";
      }, 1000);
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error(error.message || "Erro ao processar seu pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="pt-28 pb-20 text-center min-h-screen">
        <h1 className="text-3xl font-display tracking-widest mb-4">CHECKOUT</h1>
        <p className="text-muted-foreground font-body">Seu carrinho está vazio.</p>
        <Link to="/colecao" className="mt-8 inline-block text-sm font-display underline hover:no-underline">
          VOLTAR À COLEÇÃO
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-5xl mb-8 font-display tracking-widest">FINALIZAR PEDIDO</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Dados */}
          <div className="bg-secondary p-6 md:p-8 metal-border border border-border h-fit">
            <h2 className="text-xl font-display tracking-widest mb-6">SEUS DADOS</h2>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-display text-xs tracking-widest">NOME COMPLETO</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  className="bg-background"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-display text-xs tracking-widest">E-MAIL</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-background"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-display text-xs tracking-widest">WHATSAPP / CELULAR</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  className="bg-background"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", applyPhoneMask(e.target.value))}
                  maxLength={15}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document" className="font-display text-xs tracking-widest">CPF OU CNPJ</Label>
                <Input
                  id="document"
                  placeholder={formData.documentType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
                  className="bg-background"
                  value={formData.document}
                  onChange={(e) => handleDocumentChange(e.target.value)}
                  maxLength={formData.documentType === "cpf" ? 14 : 18}
                  required
                />
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-display tracking-widest flex items-center gap-2 mb-4">
                  <MapPin size={18} /> ENDEREÇO
                </h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="cep" className="font-display text-xs tracking-widest">CEP</Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      className="bg-background"
                      value={formData.cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      maxLength={9}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="font-display text-xs tracking-widest">RUA / AVENIDA</Label>
                    <Input
                      id="address"
                      placeholder="Nome da rua..."
                      className="bg-background"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="number" className="font-display text-xs tracking-widest">NÚMERO</Label>
                      <Input
                        id="number"
                        placeholder="123"
                        className="bg-background"
                        value={formData.number}
                        onChange={(e) => handleInputChange("number", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complement" className="font-display text-xs tracking-widest">COMPLEMENTO</Label>
                      <Input
                        id="complement"
                        placeholder="Apto, Sala..."
                        className="bg-background"
                        value={formData.complement}
                        onChange={(e) => handleInputChange("complement", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood" className="font-display text-xs tracking-widest">BAIRRO</Label>
                    <Input
                      id="neighborhood"
                      placeholder="Nome do bairro"
                      className="bg-background"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="font-display text-xs tracking-widest">CIDADE</Label>
                      <Input
                        id="city"
                        placeholder="Sua cidade"
                        className="bg-background"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="font-display text-xs tracking-widest">UF</Label>
                      <Input
                        id="state"
                        placeholder="UF"
                        className="bg-background"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value.toUpperCase().slice(0, 2))}
                        maxLength={2}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground font-body mt-4">
                Ao clicar em ENVIAR PEDIDO, você será redirecionado para o WhatsApp para finalizar o pagamento via PIX ou cartão.
              </p>

              <Button
                type="submit"
                variant="metal"
                size="xl"
                className="w-full mt-6"
                disabled={loading}
              >
                {loading ? "PROCESSANDO..." : "ENVIAR PEDIDO"}
              </Button>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="bg-secondary/50 p-6 md:p-8 metal-border border border-border h-fit">
            <h2 className="text-xl font-display tracking-widest mb-6 border-b border-border pb-4">RESUMO</h2>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-border/50 pb-4 last:border-0">
                  <div className="h-20 w-14 bg-background metal-border shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-display tracking-widest leading-tight">{item.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-body mt-1 uppercase">
                        {item.size} • {item.material} • Qtd: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-display tabular-nums">
                      R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {coupon && (
              <div className="mt-4 py-3 border-t border-border flex justify-between items-center text-green-600">
                <span className="text-xs font-display">Desconto ({coupon.code})</span>
                <span className="text-sm font-display">-R$ {discount.toFixed(2).replace(".", ",")}</span>
              </div>
            )}

            <div className="mt-4 pt-6 border-t border-border flex justify-between items-center">
              <p className="font-display tracking-widest text-xs">TOTAL A PAGAR</p>
              <p className="font-display text-2xl">R$ {(cartTotal - discount).toFixed(2).replace(".", ",")}</p>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-border space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Shield size={16} className="text-green-600" />
                <span className="text-xs font-body">30 dias de garantia</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Lock size={16} className="text-green-600" />
                <span className="text-xs font-body">Pagamento via WhatsApp</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-xs font-body">Satisfação garantida ou dinheiro de volta</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Send size={16} className="text-green-600" />
                <span className="text-xs font-body">Pagamento por PIX ou cartão</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
