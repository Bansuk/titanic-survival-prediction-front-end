const LOCALHOST = 'http://127.0.0.1:5000';

async function sendToApi(passengerData) {
    try {
        const apiData = {
            name: passengerData.name,
            ticket_class: parseInt(passengerData.ticket_class),
            sex: passengerData.sex,
            age: passengerData.age ? parseFloat(passengerData.age) : null,
            number_siblings_spouses: parseInt(passengerData.sibsp || 0),
            number_parents_children: parseInt(passengerData.parch || 0),
            ticket: passengerData.ticket,
            fare: passengerData.fare ? parseFloat(passengerData.fare) : null,
            cabin: passengerData.cabin || null, 
            embarked: passengerData.embarked || null
        };        
        
        const response = await fetch(`${LOCALHOST}/passenger`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.message || response.statusText}`);
        }
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        console.log(error);
        
        console.error('Erro ao enviar para API:', error);
        return null;
    }
}

async function loadFromApi() {
    try {
        const response = await fetch(`${LOCALHOST}/passengers`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        const passengers = await response.json();
        
        document.getElementById('passengersContainer').innerHTML = '';
        analyzedPassengers = [];
        
        passengers.forEach(passenger => {
            const passengerData = {
                name: passenger.name,
                pclass: passenger.ticket_class?.toString(),
                sex: passenger.sex,
                age: passenger.age?.toString(),
                sibsp: passenger.number_siblings_spouses?.toString(),
                parch: passenger.number_parents_children?.toString(),
                fare: passenger.fare?.toString(),
                embarked: passenger.embarked,
                survived: passenger.survived
            };
            
            addPassengerToList(passengerData, false);
        });
        
        
    } catch (error) {
        console.error('Erro ao carregar da API:', error);
    }
}

async function addPassengerToList(passengerData) {    
    const result = await sendToApi(passengerData);
    const survived = result.survived;
    
    const classMap = {
        '1': 'Primeira Classe',
        '2': 'Segunda Classe',
        '3': 'Terceira Classe'
    };
        
    const familySize = parseInt(passengerData.sibsp || 0) + parseInt(passengerData.parch || 0) + 1;
    const isAlone = familySize === 1;
    
    const passengerCard = document.createElement('div');
    passengerCard.className = `passenger-card ${survived ? 'survived' : 'not-survived'}`;
    
    passengerCard.innerHTML = `
        <div class="passenger-header">
            <h4 class="passenger-name">${passengerData.name}</h4>
            <div class="survival-status ${survived ? 'survived' : 'not-survived'}">
                ${survived ? '✓ Sobreviveu' : '✗ Não Sobreviveu'}
            </div>
        </div>
        <div class="passenger-details">
            <div class="detail-item">
                <strong>Classe</strong>
                <span>${classMap[passengerData.ticket_class] || 'Desconhecida'}</span>
            </div>
            <div class="detail-item">
                <strong>Sexo</strong>
                <span>${passengerData.sex === 'male' ? 'Masculino' : 'Feminino'}</span>
            </div>
            <div class="detail-item">
                <strong>Idade</strong>
                <span>${passengerData.age || 'Desconhecida'} anos</span>
            </div>
            <div class="detail-item">
                <strong>Tarifa</strong>
                <span>£${passengerData.fare || 'Desconhecida'}</span>
            </div>
            <div class="detail-item">
                <strong>Porto de Embarque</strong>
                <span>${passengerData.embarked || 'Desconhecido'}</span>
            </div>
            <div class="detail-item">
                <strong>Tamanho da Família</strong>
                <span>${familySize} ${familySize === 1 ? 'pessoa' : 'pessoas'}</span>
            </div>
            <div class="detail-item">
                <strong>Status de Viagem</strong>
                <span>${isAlone ? 'Viajando Sozinho' : 'Viajando com Família'}</span>
            </div>
            <div class="detail-item">
                <strong>Irmãos/Cônjuges</strong>
                <span>${passengerData.sibsp || 0}</span>
            </div>
            <div class="detail-item">
                <strong>Pais/Filhos</strong>
                <span>${passengerData.parch || 0}</span>
            </div>
        </div>
    `;
    
    const container = document.getElementById('passengersContainer');
    container.insertBefore(passengerCard, container.firstChild);
    
    document.getElementById('passengersList').classList.add('show');
}

document.getElementById('titanicForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    const familySize = parseInt(data.sibsp || 0) + parseInt(data.parch || 0) + 1;
    const isAlone = familySize === 1;
    
    const classMap = {
        '1': 'Primeira Classe',
        '2': 'Segunda Classe',
        '3': 'Terceira Classe'
    };
    
    const resultHTML = `
        <div class="result-item">
            <strong>Nome</strong>
            <span>${data.name}</span>
        </div>
        <div class="result-item">
            <strong>Classe</strong>
            <span>${classMap[data.pclass] || 'Desconhecida'}</span>
        </div>
        <div class="result-item">
            <strong>Sexo</strong>
            <span>${data.sex === 'male' ? 'Masculino' : 'Feminino'}</span>
        </div>
        <div class="result-item">
            <strong>Idade</strong>
            <span>${data.age} anos</span>
        </div>
        <div class="result-item">
            <strong>Tarifa</strong>
            <span>£${data.fare}</span>
        </div>
        <div class="result-item">
            <strong>Embarque</strong>
            <span>${data.embarked || 'Desconhecido'}</span>
        </div>
        <div class="result-item">
            <strong>Tamanho da Família</strong>
            <span>${familySize} ${familySize === 1 ? 'pessoa' : 'pessoas'}</span>
        </div>
        <div class="result-item">
            <strong>Status de Viagem</strong>
            <span>${isAlone ? 'Viajando Sozinho' : 'Viajando com Família'}</span>
        </div>
        <div class="result-item">
            <strong>Irmãos/Cônjuges</strong>
            <span>${data.number_siblings_spouses}</span>
        </div>
        <div class="result-item">
            <strong>Pais/Filhos</strong>
            <span>${data.number_parents_children}</span>
        </div>
    `;
    
    document.getElementById('resultContent').innerHTML = resultHTML;
    document.getElementById('result').classList.add('show');
    
    addPassengerToList(data);
    
    this.reset();
    
    document.getElementById('result').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
});

document.getElementById('loadBtn').addEventListener('click', loadFromApi);

document.getElementById('clearBtn').addEventListener('click', function() {
    analyzedPassengers = [];
    document.getElementById('passengersContainer').innerHTML = '';
    document.getElementById('passengersList').classList.remove('show');
});

document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    element.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});