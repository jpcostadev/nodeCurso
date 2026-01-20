# 📘 Padrões de Projeto — Guia Simples e Visual

Padrões de projeto são soluções reutilizáveis para problemas comuns de organização de código. Eles ajudam a deixar o código mais limpo, flexível e fácil de manter.

---

## 🏭 Factory

### 💡 O que é

Factory é usado quando você **não quer criar objetos diretamente com `new`**.  
Você pede para uma “fábrica” criar o objeto, e ela decide qual classe instanciar.

### 🧠 Ideia mental

Uma central que decide qual objeto criar pra você.

### 💻 Exemplo

    class Admin {
      getRole() {
        return "admin";
      }
    }

    class User {
      getRole() {
        return "user";
      }
    }

    class UserFactory {
      static create(type) {
        if (type === "admin") return new Admin();
        if (type === "user") return new User();
        throw new Error("Tipo inválido");
      }
    }

### ✅ Quando usar

Quando a criação do objeto começa a ficar confusa ou cheia de regras.

---

## 🎯 Strategy

### 💡 O que é

Strategy serve para **trocar o comportamento** de algo sem mudar a classe principal.  
Evita `if` ou `switch` gigantes.

### 🧠 Ideia mental

Mesmo problema, várias formas de resolver.

### 💻 Exemplo

    class Pix {
      pagar(valor) {
        return `Pago ${valor} com PIX`;
      }
    }

    class Cartao {
      pagar(valor) {
        return `Pago ${valor} com Cartão`;
      }
    }

    class Pagamento {
      constructor(formaPagamento) {
        this.formaPagamento = formaPagamento;
      }

      pagar(valor) {
        return this.formaPagamento.pagar(valor);
      }
    }

### ✅ Quando usar

Quando você precisa trocar regras ou comportamentos dinamicamente.

---

## 👀 Observer

### 💡 O que é

Observer é quando **um objeto avisa outros automaticamente** quando algo muda.

### 🧠 Ideia mental

Quem está seguindo recebe notificação.

### 💻 Exemplo

    class Canal {
      constructor() {
        this.observers = [];
      }

      subscribe(observer) {
        this.observers.push(observer);
      }

      notify(mensagem) {
        this.observers.forEach(o => o.update(mensagem));
      }
    }

    class Usuario {
      constructor(nome) {
        this.nome = nome;
      }

      update(msg) {
        console.log(this.nome + " recebeu: " + msg);
      }
    }

### ✅ Quando usar

Eventos, notificações, sistemas em tempo real.

---

## 🎁 Decorator

### 💡 O que é

Decorator permite **adicionar funcionalidades** a um objeto sem modificar a classe original.

### 🧠 Ideia mental

Funcionalidades em camadas.

### 💻 Exemplo

    class Cafe {
      custo() {
        return 5;
      }
    }

    class Leite {
      constructor(cafe) {
        this.cafe = cafe;
      }

      custo() {
        return this.cafe.custo() + 2;
      }
    }

    class Chocolate {
      constructor(cafe) {
        this.cafe = cafe;
      }

      custo() {
        return this.cafe.custo() + 3;
      }
    }

### ✅ Quando usar

Quando você quer estender funcionalidades sem herança.

---

## 🔒 Singleton

### 💡 O que é

Singleton garante que **só exista uma instância** da classe em toda a aplicação.

### 🧠 Ideia mental

Uma configuração global única.

### 💻 Exemplo

    class Config {
      static instance;

      constructor() {
        if (Config.instance) {
          return Config.instance;
        }
        this.appName = "Meu App";
        Config.instance = this;
      }
    }

### ✅ Quando usar

Configurações globais, conexões, logs.

---

## 🔌 Adapter

### 💡 O que é

Adapter faz **interfaces incompatíveis conversarem** sem alterar o código original.

### 🧠 Ideia mental

Um tradutor entre dois sistemas.

### 💻 Exemplo

    class ApiAntiga {
      enviarMensagem(texto) {
        console.log("Antiga:", texto);
      }
    }

    class ApiAdapter {
      constructor(apiAntiga) {
        this.apiAntiga = apiAntiga;
      }

      send(mensagem) {
        this.apiAntiga.enviarMensagem(mensagem);
      }
    }

### ✅ Quando usar

Integração com APIs antigas ou bibliotecas externas.

---

## 🧠 Resumo Final

- 🏭 Factory → cria objetos
- 🎯 Strategy → troca comportamento
- 👀 Observer → avisa mudanças
- 🎁 Decorator → adiciona funcionalidades
- 🔒 Singleton → instância única
- 🔌 Adapter → adapta interfaces
