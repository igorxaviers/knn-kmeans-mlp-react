class Neuron {
    #gradientError
    #error;
    #i;
    #net;

    constructor() {
        this.#error = 0;
        this.#i = 0;
        this.#net = 0;
        this.#gradientError = 0;
    }

    //Valor utilizado para realizar o cálculo do erro geral da rede (apenas nos neurônios de saída)
    get getError() {
        return this.#error;
    }
    set setError(error) {
        this.#error = error;
    }

    get getGradientError() {
        return this.#gradientError;
    }
    set setGradientError(gradientError) {
        this.#gradientError = gradientError;
    }

    get getI() {
        return this.#i;
    }
    set setI(i) {
        this.#i = i;
    }

    get getNet() {
        return this.#net;
    }
    set setNet(net) {
        this.#net = net;
    }
}


export default Neuron;