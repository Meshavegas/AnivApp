const timerValue = () => {
  const minutes = Math.floor(validationsTimer / 60);
  const seconds = validationsTimer % 60;
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }
       `;
};

const initPayTimer = () => {
  const pay_timer = setInterval(() => {
    // window.$('#timerValue').text(this.timerValue)
    setValidationsTimer((timer) => timer - 1);
  }, 1000);
};
const stopPayTimer = () => {
  clearInterval(pay_timer);
  validationsTimer = 50 * 60;
  // window.$('#timerValue').text(this.timerValue)
};

const initInterval = () => {
  let count = 0;
  timer = setInterval(async () => {
    const status = await payCheck();
    if (status !== null) {
      onPaySubmit(status);
    }

    count++;

    if (count >= 5) {
      onPaySubmit(false);
    }
  }, 10000);
};

const onPaySubmit = (status) => {
  stopPayTimer();

  // window.$('#payment-pending').hide(100)
  // window.$('#form-vote').show(100)

  // window.$('#modal-vote').trigger('close')

  this.pay_ref = "";

  if (status) {
    // alert('Votre vote a été pris en compte')
  } else {
  }
};

const executeFunction = () => {
  // Votre fonction à exécuter
  setValidationsTimer((timer) => timer - 1);
  console.log("Exécution de la fonction...");

  if (isValidated) {
    // setIsOperationValidated(true);
    clearInterval(interval);
    console.log("Opération validée. Arrêt de la boucle.");
  }
};

const initTimer = () => {
  let counter = 0;
  const interval = setInterval(() => {
    executeFunction();
    counter++;
    if (counter >= 300) {
      console.log("stop");
      clearInterval(interval);
    }
  }, 1000);
};
