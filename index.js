const createElements = (arr) => {
    const htmlElements = arr.map(el => `<span class="btn">${el}</span>`);
    return htmlElements.join(" ");
}
const manageSpinner = (status) => {
    if(status == true)
    {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    }
    else
        {
            document.getElementById('word-container').classList.remove('hidden');
            document.getElementById('spinner').classList.add('hidden');
    }
}
const loadLessons = () => {
    const url = 'https://openapi.programming-hero.com/api/levels/all';
    fetch(url)
        .then(response => response.json())
        .then((json) => displayLessons(json.data));
}
const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then((response) => response.json())
        .then((json) => {
            removeActive();
            const clickBtn = document.getElementById(`lesson-btn-${id}`)
            clickBtn.classList.add('active');
            displayLevelWord(json.data)
        })
}

const removeActive = () => {
    const lessonButtons = document.querySelectorAll('.lesson-btn')
    lessonButtons.forEach(btn => btn.classList.remove('active'))
}
const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
}
const displayWordDetails = (word) => {
    const detailsBox = document.getElementById('details-container');
    detailsBox.innerHTML = `
    <div>
                    <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
                </div>
                <div>
                    <h2 class="font-bold">Meaning</h2>
                    <p class="font-bangla">${word.meaning}</p>
                </div>
                <div>
                    <h2 class="font-bold">Example</h2>
                    <p>${word.sentence}</p>
                </div>
                <div class="">
                    <h2 class="font-bold font-bangla">সমার্থক শব্দ গুলো</h2>
                    <div class="">
                    ${createElements(word.synonyms)}
                    </div>
                </div>
    `
    document.getElementById('word_modal').showModal();
}
const displayLevelWord = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = "";
    if (words.length == 0) {
        wordContainer.innerHTML = `
        <div class="card-default-content col-span-full mx-auto space-y-4 text-center">
        <img class="mx-auto" src="/assets/alert-error.png" alt="">
            <p class="text-[#79716B] font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <p class="text-[#292524] font-bangla text-4xl">নেক্সট Lesson এ যান</p>
        </div>`;
        manageSpinner(false);
        return;
    }
    for (let word of words) {
        const card = document.createElement('div');
        card.innerHTML = `
        <div class="card bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-6">
            <h2 class="text-3xl font-bold">${word.word ? word.word : "শব্দ পাওয়া যায় নি"}</h2>
            <p class="text-[20px]">Meaning /Pronounciation</p>
            <div>
                <p class="text-[32px] text-[#18181B] font-bangla font-semibold">"${word.meaning ? word.meaning : "শব্দ পাওয়া যায় নি"} / ${word.pronunciation ? word.pronunciation : "শব্দ পাওয়া যায় নি"}"</p>
            </div>
            <div class="button flex justify-between items-center">
                <div class="btn1 border-none bg-gray-200 p-2 rounded-md cursor-pointer">
                    <button class="cursor-pointer" onclick="loadWordDetail(${word.id})">
                        <i class="fa-solid fa-circle-info cursor-pointer"></i>
                    </button>
                </div>
                <div class="btn2 border-none bg-gray-200 p-2 rounded-md cursor-pointer">
                    <button class="cursor-pointer">
                        <i class="fa-solid fa-volume-high cursor-pointer"></i>
                    </button>
                </div>
            </div>
        </div>`;
        wordContainer.append(card);
    }
    manageSpinner(false);
}
const displayLessons = (lessons) => {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = "";
    for (let lesson of lessons) {
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book"></i>Lesson - ${lesson.level_no}</button>
        `;
        levelContainer.append(btnDiv);
    }
}
loadLessons();

document.getElementById('btn-search').addEventListener('click', () =>{
    removeActive();
    const input = document.getElementById('input-search');
    const searchValue = input.value.trim().toLowerCase();
    fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res => res.json())
    .then(data => {
        const allWords = data.data;
        const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
        displayLevelWord(filterWords);
    });
    
    
    
})