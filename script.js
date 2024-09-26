let resultDraw;
let cardsResult = [];

let cardId = 1;

document.addEventListener("DOMContentLoaded", () => {


    addEventInNumberButtons(document.querySelectorAll(".btn-number"));

    const resultButton = document.querySelector(".result button");
    resultButton.addEventListener("click", () => {
        console.log(document.querySelector("#draw-name").value)
        if (!document.querySelector("#draw-name").value) {
            window.alert("Por favor, digite o número do sorteio");
            return;
        }
        checkResult();
        resultButton.disabled = true;
        window.scrollTo(0, 0);
    });

    const addCardButton = document.querySelector(".add-card button");
    addCardButton.addEventListener("click", () => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h2>Cartela ${++cardId}</h2>
            <div class="numbers">
                <input type="button" class="btn-number" id="n1" value="01">
                <input type="button" class="btn-number" id="n2" value="02">
                <input type="button" class="btn-number" id="n3" value="03">
                <input type="button" class="btn-number" id="n4" value="04">
                <input type="button" class="btn-number" id="n5" value="05">
                <input type="button" class="btn-number" id="n6" value="06">
                <input type="button" class="btn-number" id="n7" value="07">
                <input type="button" class="btn-number" id="n8" value="08">
                <input type="button" class="btn-number" id="n9" value="09">
                <input type="button" class="btn-number" id="n10" value="10">
                <input type="button" class="btn-number" id="n11" value="11">
                <input type="button" class="btn-number" id="n12" value="12">
                <input type="button" class="btn-number" id="n13" value="13">
                <input type="button" class="btn-number" id="n14" value="14">
                <input type="button" class="btn-number" id="n15" value="15">
                <input type="button" class="btn-number" id="n16" value="16">
                <input type="button" class="btn-number" id="n17" value="17">
                <input type="button" class="btn-number" id="n18" value="18">
                <input type="button" class="btn-number" id="n19" value="19">
                <input type="button" class="btn-number" id="n20" value="20">
                <input type="button" class="btn-number" id="n21" value="21">
                <input type="button" class="btn-number" id="n22" value="22">
                <input type="button" class="btn-number" id="n23" value="23">
                <input type="button" class="btn-number" id="n24" value="24">
                <input type="button" class="btn-number" id="n25" value="25">
            </div>
        `;
        document.querySelector(".cards").appendChild(card);

        const newButtons = card.querySelectorAll(".btn-number");
        addEventInNumberButtons(newButtons);
    });
});

function addEventInNumberButtons(buttons) {
    Array.from(buttons).forEach((button) => {
        button.addEventListener("click", () => {
            button.classList.toggle("selected");
        });
    });
}

async function checkResult() {
    const prizeDrawNumber = document.querySelector("#draw-name").value;

    await getResultFromApi(prizeDrawNumber).then((numbers) => {
        resultDraw = numbers;
    });

    const cards = document.querySelectorAll(".cards .card");
    
    let cardId = 1;
    cards.forEach((card) => {
        const cardResult = {
            cardId,
            correctNumbers: [],
            totalCorrectNumbers: 0,
            totalIncorrectNumbers: 0
        };

        card.querySelectorAll(".btn-number.selected").forEach((button) => {
            resultDraw.find((value) => {
                if (value == button.value) {
                    cardResult.correctNumbers.push(value);
                    cardResult.totalCorrectNumbers++;
                    button.classList.add("correct");
                }
            });
        });


        card.classList.add("disabled");

        cardsResult.push(cardResult);

        cardId++;
    });

    showResults();
    showResultNumbersBySorteio(prizeDrawNumber);
}

function showResults() {
    const cards = document.querySelectorAll(".cards .card");

    cards.forEach((card, index) => {
        const resultCard = document.createElement("div");
        resultCard.classList.add("result-card");
        resultCard.innerHTML = `
                <span>Acertou ${cardsResult[index].totalCorrectNumbers} números</span>
        `;

        card.appendChild(resultCard);
    });
}

function showResultNumbersBySorteio(sorteioNumber) {
    const resultNumbersElement = document.createElement("div");
    resultNumbersElement.classList.add("result-numbers");

    const sorteioTitleElement = document.createElement("h3");
    sorteioTitleElement.textContent = `Sorteio ${sorteioNumber}`;

    resultNumbersElement.innerHTML = resultDraw.map((number) => {
        return `<div class="result-number">${number}</div>`;
    }).join("");

    document.querySelector(".result-draw").appendChild(sorteioTitleElement);
    document.querySelector(".result-draw").appendChild(resultNumbersElement);
}



async function getResultFromApi(prizeDrawNumber) {

    try {
        const apiUrl = "https://loteriascaixa-api.herokuapp.com/api/lotofacil/"+prizeDrawNumber;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();

        return data.dezenas;
    } catch (error) {
        console.error("Erro ao consultar a API:", error);
        return null; 
    }
}
