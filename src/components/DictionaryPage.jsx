import './DictionaryPage.css'

function pluralizeWord(count) {
    if (count % 100 >= 11 && count % 100 <= 14) {
        return "слов"
    }

    switch (count % 10) {
        case 1:
            return "слово"
        case 2:
        case 3:
        case 4:
            return "слова"
        default:
            return "слов"
    }
}

export function DictionaryPage ({ onBack }) {
    const dictionary = [
        { id: 1, word: 'mais', translation: 'но' },
        { id: 2, word: 'frère', translation: 'брат' },
        { id: 3, word: 'fils', translation: 'сын' },
        { id: 4, word: 'tante', translation: 'тётя' },
        { id: 5, word: 'toujours', translation: 'всегда' },
        { id: 6, word: 'intéressant', translation: 'интересный' },
        { id: 7, word: 'très', translation: 'очень' },
        { id: 8, word: 'nièce', translation: 'племянница' },
        { id: 9, word: 'sœur', translation: 'сестра' },
        { id: 10, word: 'elle', translation: 'она' },
        { id: 11, word: 'est', translation: ' обстоит' },
        { id: 12, word: 'bien sûr', translation: 'конечно' },
        { id: 13, word: 'il', translation: 'он' },
        { id: 14, word: 'méchant', translation: 'злой' },
        { id: 15, word: 'amusant', translation: 'веселый' },
        { id: 16, word: 'il vient', translation: 'приходит' },
        { id: 17, word: 'il habite', translation: 'живет' },
        { id: 18, word: 'neveu', translation: 'племянник' },
        { id: 19, word: 'nièce', translation: 'племянница' },
        { id: 20, word: 'à', translation: 'c за к чем чтобы об во на со о до' },
        { id: 21, word: 'habite', translation: 'живет' },
        { id: 22, word: 'maintenant', translation: 'теперь' },
        { id: 23, word: 'once', translation: 'дядя' },
        { id: 24, word: 'tante', translation: 'тетя' },
        { id: 25, word: 'de', translation: 'из изо' },
        { id: 26, word: 'une', translation: 'одна' },
        { id: 27, word: 'elle vient', translation: 'c из' },
        { id: 28, word: 'j\'ai', translation: 'у меня есть' },
        { id: 29, word: 'fille', translation: 'дочь' },
        { id: 30, word: 'sœur', translation: 'сестра' },
        { id: 31, word: 'fils', translation: 'сын' },
        { id: 32, word: 'tu as', translation: 'у тебя есть' },
        { id: 33, word: 'oh', translation: 'о' },
        { id: 34, word: 'frère', translation: 'брат' },
        { id: 35, word: 'tu viens de', translation: 'ты из' },
        { id: 36, word: 'tu viens d\'où', translation: 'ты откуда' },
        { id: 37, word: 'à bientôt', translation: 'до скорой встречи' },
        { id: 38, word: 'viens de', translation: 'что' },
        { id: 39, word: 'moi aussi', translation: 'я тоже' },
        { id: 40, word: 'je', translation: 'я' },
        { id: 41, word: 'et toi', translation: 'а тебя' },
        { id: 42, word: 'je m\'appelle', translation: 'меня зовут' },
        { id: 43, word: 'bien', translation: 'хорошо' },
        { id: 44, word: 'ça va', translation: 'как дела' },
        { id: 45, word: 'enchanté', translation: 'приятно познакомиться' },
        { id: 46, word: 'au revoir', translation: 'до свидания' },
        { id: 47, word: 'parfait', translation: 'отлично' },
        { id: 48, word: 'ou', translation: 'или' },
    ];

    return (
        <div className="dictionary-page">
            <div className="dictionary-container">
                <button className="back-btn" onClick={ onBack }>
                    ← Назад
                </button>
                <header className="dictionary-header">
                    <h1>Словарь</h1>
                    <p>{dictionary.length} {pluralizeWord(dictionary.length)}</p>
                </header>
                <div className="dictionary-list">
                    {dictionary.map(item => (
                        <div key={item.id} className="dictionary-item">
                            <div className="dictionary-content">
                                <span className="dictionary-word">{item.word}</span>
                                <span className="dictionary-translation">{item.translation}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}