const fs = require('fs');
const path = require('path');

const descriptions = {
    "bioquimica": "Estudo das reações químicas e biológicas nos organismos vivos, essencial para entender o metabolismo.",
    "hematologia": "Estudo do sangue, seus componentes e distúrbios, fundamental para diagnósticos clínicos.",
    "anatomia": "Exploração das estruturas do corpo humano e sua organização sistêmica.",
    "fisiologia": "Compreensão do funcionamento normal do corpo humano e seus mecanismos de regulação.",
    "farmacologia": "Estudo dos medicamentos, seus mecanismos de ação, interações e efeitos no organismo.",
    "imunologia": "Análise do sistema imune e suas respostas a patógenos e doenças.",
    "microbiologia": "Estudo dos microrganismos, incluindo bactérias, vírus e fungos, e seu impacto na saúde.",
    "parasitologia": "Investigação dos parasitas, seus ciclos de vida e as doenças que causam em humanos.",
    "biologia-molecular": "Estudo das bases moleculares da vida, focando em DNA, RNA e síntese de proteínas.",
    "genetica": "Compreensão da hereditariedade e das variações genéticas na biologia humana.",
    "citologia": "Estudo da estrutura, função e patologia das células.",
    "histologia": "Exame microscópico dos tecidos biológicos e sua organização anatômica.",
    "patologia": "Estudo das doenças, suas causas, mecanismos e alterações estruturais nas células e tecidos.",
    "urinalise": "Análise clínica da urina para avaliação da função renal e diagnóstico de doenças do trato urinário.",
    "toxicologia": "Estudo dos efeitos adversos das substâncias químicas nos organismos vivos.",
    "imunohematologia": "Estudo dos antígenos e anticorpos do sangue, crucial para transfusões seguras.",
    "epidemiologia": "Análise da distribuição e dos determinantes de saúde e doenças nas populações.",
    "biotecnologia": "Aplicação de organismos vivos ou seus sistemas para desenvolver produtos ou processos biológicos.",
    "bioetica": "Discussão dos dilemas éticos relacionados aos avanços da biologia e da medicina.",
    "gestao-laboratorial": "Princípios de administração, controle de qualidade e normatização em laboratórios clínicos.",
    "biomedicina-estetica": "Aplicação de procedimentos estéticos baseados em conhecimentos biomédicos."
};

const dir = 'src/content/disciplines';
fs.readdirSync(dir).forEach(discFolder => {
    const p = path.join(dir, discFolder, 'discipline.json');
    if (fs.existsSync(p)) {
        let data = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (!data.description) {
            data.description = descriptions[data.id] || "Estudo avançado de conceitos fundamentais para a prática e pesquisa em Biomedicina.";
            fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
        }
    }
});
