<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Sector;
use App\Models\Service;
use Illuminate\Database\Seeder;

class SectorsAndServicesSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info("Criando setores e servicos...\n");
        $locations = Location::all()->keyBy('name');

        // PREDIO ADMINISTRACAO
        if ($loc = $locations->get('Prédio Administração')) {
            $this->cs($loc, 'Diretoria Geral', 'Direção geral do campus', '1º Andar', '07:00', '17:00', [
                ['Atendimento ao Público', 'Atendimento presencial para comunidade acadêmica e externa'],
                ['Protocolo e Documentação', 'Recebimento e encaminhamento de documentos oficiais'],
                ['Ouvidoria', 'Canal de reclamações, sugestões e elogios'],
            ]);
            $this->cs($loc, 'Diretoria de Administração e Planejamento', 'Gestão administrativa, orçamentária e patrimonial', '1º Andar', '07:00', '17:00', [
                ['Gestão Orçamentária', 'Planejamento e execução do orçamento do campus'],
                ['Contratos e Convênios', 'Gerenciamento de contratos e convênios institucionais'],
                ['Patrimônio', 'Controle e registro de bens patrimoniais'],
            ]);
            $this->cs($loc, 'Diretoria de Ensino', 'Coordenação das atividades de ensino', '1º Andar', '07:00', '17:00', [
                ['Coordenação Pedagógica', 'Acompanhamento e orientação pedagógica dos cursos'],
                ['Registro Acadêmico', 'Matrículas, históricos, declarações e diplomas'],
                ['Apoio ao Estudante', 'Programas de assistência e permanência estudantil'],
            ]);
            $this->cs($loc, 'Coordenação de Gestão de Pessoas', 'Gestão de servidores e colaboradores', 'Térreo', '07:00', '17:00', [
                ['Recursos Humanos', 'Admissão, frequência e folha de pagamento de servidores'],
                ['Capacitação e Desenvolvimento', 'Programas de qualificação e capacitação de servidores'],
            ]);
            $this->cs($loc, 'Coordenação de TI', 'Suporte e infraestrutura de TI do campus', 'Térreo', '07:00', '17:00', [
                ['Suporte Técnico', 'Atendimento e resolução de problemas de informática'],
                ['Infraestrutura de Rede', 'Manutenção de rede, internet e servidores'],
                ['Sistemas Institucionais', 'Suporte aos sistemas acadêmicos e administrativos'],
            ]);
            $this->cs($loc, 'Coordenação de Comunicação Social', 'Comunicação institucional e divulgação', '1º Andar', '07:00', '17:00', [
                ['Assessoria de Imprensa', 'Divulgação de notícias e eventos do campus'],
                ['Mídias Sociais', 'Gerenciamento das redes sociais institucionais'],
            ]);
        }

        // PREDIO I - Ensino Geral
        if ($loc = $locations->get('Prédio I')) {
            $this->cs($loc, 'Salas de Aula - Térreo', 'Salas de aula para cursos técnicos e superiores', 'Térreo', '07:00', '22:30', [
                ['Aulas Teóricas', 'Salas equipadas com projetor e quadro branco'],
            ]);
            $this->cs($loc, 'Salas de Aula - 1º Andar', 'Salas de aula para cursos técnicos e superiores', '1º Andar', '07:00', '22:30', [
                ['Aulas Teóricas', 'Salas equipadas com projetor e quadro branco'],
            ]);
            $this->cs($loc, 'Laboratório de Ciências', 'Laboratório para aulas práticas de ciências', '1º Andar', '07:00', '17:00', [
                ['Aulas Práticas de Biologia', 'Experimentos e análises biológicas'],
                ['Aulas Práticas de Química', 'Experimentos e análises químicas'],
                ['Aulas Práticas de Física', 'Experimentos e práticas de física'],
            ]);
        }

        // PREDIO II - Tecnologia (1 andar apenas)
        if ($loc = $locations->get('Prédio II')) {
            $this->cs($loc, 'Salas de Aula', 'Salas de aula dos cursos da área de tecnologia', 'Térreo', '07:00', '22:00', [
                ['Aulas Teóricas', 'Aulas dos cursos técnicos e superiores da área de tecnologia'],
            ]);
            $this->cs($loc, 'Laboratório de Informática', 'Laboratório com computadores para aulas práticas', 'Térreo', '07:00', '22:00', [
                ['Aulas Práticas de Programação', 'Prática de desenvolvimento de software e sistemas'],
                ['Aulas Práticas de Hardware', 'Montagem, manutenção e configuração de computadores'],
                ['Acesso Livre a Computadores', 'Horários disponíveis para uso livre dos alunos'],
            ]);
            $this->cs($loc, 'Laboratório de Redes', 'Laboratório de infraestrutura de redes de computadores', 'Térreo', '07:00', '22:00', [
                ['Aulas Práticas de Redes', 'Configuração de roteadores, switches e cabeamento estruturado'],
                ['Práticas de Servidores', 'Instalação e configuração de servidores e serviços de rede'],
            ]);
            $this->cs($loc, 'Suporte de TI', 'Setor de suporte técnico de informática do campus', 'Térreo', '07:00', '17:00', [
                ['Suporte Técnico', 'Atendimento e resolução de problemas de informática para o campus'],
                ['Manutenção de Equipamentos', 'Reparo e manutenção de computadores e periféricos'],
            ]);
            $this->cs($loc, 'Coordenação do Técnico em Informática', 'Coordenação do curso Técnico em Informática', 'Térreo', '07:00', '17:00', [
                ['Atendimento a Alunos', 'Orientação acadêmica para alunos do curso técnico'],
                ['Orientação de Estágio', 'Acompanhamento de estágios obrigatórios do curso técnico'],
            ]);
            $this->cs($loc, 'Coordenação do Curso Superior de Tecnologia', 'Coordenação do curso superior da área de tecnologia', 'Térreo', '07:00', '17:00', [
                ['Atendimento a Alunos', 'Orientação acadêmica para alunos do curso superior'],
                ['Orientação de TCC e Estágio', 'Acompanhamento de trabalhos de conclusão e estágios'],
            ]);
        }

        // PREDIO III - Biologia / Agrárias (1 andar)
        if ($loc = $locations->get('Prédio III')) {
            $this->cs($loc, 'Salas de Aula', 'Salas de aula dos cursos de Biologia e Ciências Agrárias', 'Térreo', '07:00', '22:40', [
                ['Aulas Teóricas', 'Aulas dos cursos da área de Biologia e Ciências Agrárias'],
            ]);
            $this->cs($loc, 'Laboratório Multidisciplinar', 'Laboratório para práticas de Biologia e áreas agrárias', 'Térreo', '07:00', '17:00', [
                ['Práticas de Biologia', 'Experimentos e análises em biologia geral e microbiologia'],
                ['Práticas de Ciências Agrárias', 'Análises de solo, água e práticas agronômicas'],
            ]);
            $this->cs($loc, 'Coordenação de Curso', 'Coordenação dos cursos de Biologia e Ciências Agrárias', 'Térreo', '07:00', '17:00', [
                ['Atendimento a Alunos', 'Orientação acadêmica e acompanhamento dos alunos'],
                ['Orientação de Estágio e TCC', 'Acompanhamento de estágios e trabalhos de conclusão'],
            ]);
        }

        // PREDIO IV - Matemática (1 andar)
        if ($loc = $locations->get('Prédio IV')) {
            $this->cs($loc, 'Salas de Aula', 'Salas de aula dos cursos da área de Matemática', 'Térreo', '07:00', '22:40', [
                ['Aulas Teóricas', 'Aulas dos cursos da área de Matemática e afins'],
            ]);
            $this->cs($loc, 'Laboratório de Informática', 'Laboratório com computadores para práticas de Matemática', 'Térreo', '07:00', '22:00', [
                ['Aulas Práticas com Softwares', 'Uso de softwares matemáticos e estatísticos (GeoGebra, R, etc.)'],
                ['Acesso Livre a Computadores', 'Horários disponíveis para uso livre dos alunos'],
            ]);
            $this->cs($loc, 'Coordenação de Curso', 'Coordenação dos cursos da área de Matemática', 'Térreo', '07:00', '17:00', [
                ['Atendimento a Alunos', 'Orientação acadêmica e acompanhamento dos alunos'],
                ['Orientação de Estágio e TCC', 'Acompanhamento de estágios e trabalhos de conclusão'],
            ]);
        }

        // BIBLIOTECA
        if ($loc = $locations->get('Biblioteca')) {
            $this->cs($loc, 'Acervo e Empréstimo', 'Setor de acervo bibliográfico e empréstimo de livros', 'Térreo', '07:00', '21:00', [
                ['Empréstimo de Livros', 'Empréstimo e devolução de material bibliográfico'],
                ['Consulta ao Acervo', 'Pesquisa e consulta local de livros, periódicos e revistas'],
                ['Reserva de Material', 'Reserva online e presencial de livros'],
            ]);
            $this->cs($loc, 'Sala de Estudos', 'Espaço silencioso para estudo individual e em grupo', 'Térreo', '07:00', '21:00', [
                ['Estudo Individual', 'Mesas e cabines individuais para estudo'],
                ['Estudo em Grupo', 'Salas reservadas para trabalhos em grupo'],
            ]);
            $this->cs($loc, 'Setor de Multimídia', 'Computadores e recursos digitais para pesquisa', 'Térreo', '07:00', '21:00', [
                ['Acesso a Bases de Dados', 'Consulta a periódicos e bases científicas (CAPES, SciELO)'],
                ['Computadores para Pesquisa', 'Estações com acesso à internet para pesquisa acadêmica'],
            ]);
        }

        // REFEITORIO
        if ($loc = $locations->get('Refeitório')) {
            $this->cs($loc, 'Cozinha e Preparo', 'Área de preparo das refeições', 'Térreo', '05:30', '18:00', [
                ['Café da Manhã', 'Servido para alunos internos e residentes'],
                ['Almoço', 'Refeição principal servida para toda a comunidade'],
                ['Jantar', 'Refeição noturna para alunos internos e do turno noturno'],
            ]);
            $this->cs($loc, 'Salão de Refeições', 'Espaço de alimentação com mesas e cadeiras', 'Térreo', '06:00', '19:00', [
                ['Alimentação', 'Espaço para realização das refeições'],
            ]);
            $this->cs($loc, 'Nutrição', 'Coordenação de nutrição e cardápio', 'Térreo', '07:00', '17:00', [
                ['Acompanhamento Nutricional', 'Planejamento de cardápio equilibrado e adequado'],
                ['Atendimento Dietético', 'Orientação para alunos com restrições alimentares'],
            ]);
        }

        // AMBULATORIO
        if ($loc = $locations->get('Ambulatório')) {
            $this->cs($loc, 'Enfermaria', 'Atendimento de enfermagem e primeiros socorros', 'Térreo', '07:00', '17:00', [
                ['Primeiros Socorros', 'Atendimento emergencial básico'],
                ['Administração de Medicamentos', 'Distribuição de medicamentos com prescrição'],
                ['Curativos e Procedimentos', 'Curativos, aferição de pressão e glicemia'],
            ]);
            $this->cs($loc, 'Consultório Médico', 'Atendimento médico para a comunidade acadêmica', 'Térreo', '08:00', '12:00', [
                ['Consultas Médicas', 'Atendimento clínico geral para alunos e servidores'],
                ['Atestados e Encaminhamentos', 'Emissão de atestados e encaminhamentos para especialistas'],
            ]);
            $this->cs($loc, 'Consultório Odontológico', 'Atendimento odontológico básico', 'Térreo', '08:00', '17:00', [
                ['Atendimento Odontológico', 'Consultas e procedimentos odontológicos básicos'],
                ['Orientação de Saúde Bucal', 'Campanhas e orientações de higiene bucal'],
            ]);
            $this->cs($loc, 'Psicologia', 'Acompanhamento psicológico', 'Térreo', '08:00', '17:00', [
                ['Atendimento Psicológico', 'Acolhimento e acompanhamento psicológico individual'],
                ['Apoio Emocional ao Estudante', 'Suporte para questões emocionais e adaptação acadêmica'],
            ]);
        }

        // GINASIO
        if ($loc = $locations->get('Ginásio Poliesportivo')) {
            $this->cs($loc, 'Quadra Coberta', 'Quadra poliesportiva coberta', 'Térreo', '07:00', '22:00', [
                ['Aulas de Educação Física', 'Aulas práticas de educação física curricular'],
                ['Treinamento Esportivo', 'Treinos de equipes esportivas do campus'],
                ['Eventos Esportivos', 'Competições internas e jogos intercampi'],
            ]);
            $this->cs($loc, 'Vestiários', 'Vestiários masculino e feminino', 'Térreo', '07:00', '22:00', [
                ['Uso dos Vestiários', 'Vestiários com chuveiros e armários para uso dos alunos'],
            ]);
            $this->cs($loc, 'Sala de Musculação', 'Espaço com equipamentos de musculação', 'Térreo', '06:00', '21:00', [
                ['Musculação e Exercícios', 'Prática de exercícios físicos e musculação orientada'],
            ]);
        }

        // GUARITA
        if ($loc = $locations->get('Guarita')) {
            $this->cs($loc, 'Portaria e Vigilância', 'Controle de acesso e segurança do campus', 'Térreo', '00:00', '23:59', [
                ['Controle de Acesso', 'Identificação e registro de entrada e saída de pessoas e veículos'],
                ['Vigilância Patrimonial', 'Rondas e monitoramento de segurança 24 horas'],
                ['Informações ao Visitante', 'Orientação e direcionamento de visitantes no campus'],
            ]);
        }

        // ALOJAMENTOS
        if ($loc = $locations->get('Alojamento Masculino')) {
            $this->cs($loc, 'Quartos e Dormitórios', 'Alojamento para estudantes do sexo masculino', 'Térreo', null, null, [
                ['Moradia Estudantil', 'Quartos compartilhados para alunos em regime de internato'],
                ['Lavanderia', 'Área com tanques e varais para lavagem de roupas'],
            ]);
            $this->cs($loc, 'Área de Convivência', 'Espaço de socialização e descanso', 'Térreo', null, null, [
                ['Sala de TV e Convivência', 'Espaço para lazer e interação entre os alunos internos'],
            ]);
        }
        if ($loc = $locations->get('Alojamento Feminino')) {
            $this->cs($loc, 'Quartos e Dormitórios', 'Alojamento para estudantes do sexo feminino', 'Térreo', null, null, [
                ['Moradia Estudantil', 'Quartos compartilhados para alunas em regime de internato'],
                ['Lavanderia', 'Área com tanques e varais para lavagem de roupas'],
            ]);
            $this->cs($loc, 'Área de Convivência', 'Espaço de socialização e descanso', 'Térreo', null, null, [
                ['Sala de TV e Convivência', 'Espaço para lazer e interação entre as alunas internas'],
            ]);
        }

        // AGROINDUSTRIA
        if ($loc = $locations->get('Agroindústria')) {
            $this->cs($loc, 'Lab de Processamento de Alimentos', 'Processamento e beneficiamento de produtos agrícolas', 'Térreo', '07:00', '17:00', [
                ['Aulas Práticas de Agroindústria', 'Práticas de processamento de alimentos'],
                ['Produção de Derivados', 'Fabricação de produtos derivados para consumo e estudo'],
            ]);
            $this->cs($loc, 'Lab de Análise de Alimentos', 'Análise de qualidade de produtos alimentícios', 'Térreo', '07:00', '17:00', [
                ['Análise Bromatológica', 'Análise de composição e qualidade dos alimentos'],
                ['Controle de Qualidade', 'Verificação de padrões sanitários e microbiológicos'],
            ]);
        }

        // SILVICULTURA
        if ($loc = $locations->get('Prédio Silvicultura I')) {
            $this->cs($loc, 'Lab de Silvicultura', 'Laboratório de práticas florestais', 'Térreo', '07:00', '17:00', [
                ['Aulas Práticas de Silvicultura', 'Práticas de manejo florestal e produção de mudas'],
                ['Pesquisa Florestal', 'Projetos de pesquisa em ciências florestais'],
            ]);
            $this->cs($loc, 'Sala de Aula', 'Sala para aulas teóricas da área florestal', 'Térreo', '07:00', '21:00', [
                ['Aulas Teóricas', 'Aulas dos cursos ligados à área florestal e ambiental'],
            ]);
        }
        if ($loc = $locations->get('Prédio Silvicultura II')) {
            $this->cs($loc, 'Viveiro e Lab de Sementes', 'Espaço para análise e beneficiamento de sementes', 'Térreo', '07:00', '17:00', [
                ['Análise de Sementes', 'Testes de germinação e vigor de sementes florestais'],
                ['Beneficiamento de Sementes', 'Processamento e armazenamento de sementes'],
            ]);
        }

        // ONE-BIT
        if ($loc = $locations->get('Prédio da One-Bit')) {
            $this->cs($loc, 'Incubadora de Empresas', 'Espaço para empreendedorismo e inovação', 'Térreo', '08:00', '18:00', [
                ['Apoio a Startups', 'Orientação e mentoria para projetos de empreendedorismo'],
                ['Coworking', 'Espaço compartilhado de trabalho para projetos inovadores'],
            ]);
            $this->cs($loc, 'Lab de Inovação', 'Espaço para projetos de extensão e inovação tecnológica', 'Térreo', '08:00', '18:00', [
                ['Projetos de Extensão', 'Desenvolvimento de projetos com impacto na comunidade'],
                ['Inovação Tecnológica', 'Prototipagem e desenvolvimento de soluções tecnológicas'],
            ]);
        }

        // CENTRO DE VIVENCIA
        if ($loc = $locations->get('Centro de Vivência')) {
            $this->cs($loc, 'Grêmio Estudantil', 'Espaço de organização e representação estudantil', 'Térreo', '07:00', '22:00', [
                ['Atividades Estudantis', 'Reuniões, eventos e ações organizadas pelos alunos'],
                ['Representação Estudantil', 'Atuação do grêmio junto à gestão do campus'],
            ]);
            $this->cs($loc, 'Espaço de Convivência', 'Área de lazer e socialização', 'Térreo', '07:00', '22:00', [
                ['Lazer e Recreação', 'Jogos de mesa, TV e espaço para descanso'],
                ['Eventos Culturais', 'Saraus, shows e eventos culturais organizados pela comunidade'],
            ]);
        }

        // TOPOGRAFIA
        if ($loc = $locations->get('Topografia')) {
            $this->cs($loc, 'Lab de Topografia e Geoprocessamento', 'Equipamentos e práticas de topografia', 'Térreo', '07:00', '17:00', [
                ['Aulas Práticas de Topografia', 'Levantamentos topográficos com estação total e GPS'],
                ['Geoprocessamento', 'Análise espacial e uso de ferramentas de SIG'],
            ]);
        }

        // MUSEU
        if ($loc = $locations->get('Museu de Zoologia')) {
            $this->cs($loc, 'Acervo Zoológico', 'Coleção de espécimes animais para estudo e exposição', 'Térreo', '08:00', '17:00', [
                ['Exposição Permanente', 'Visitação ao acervo de espécimes da fauna regional'],
                ['Visitas Guiadas', 'Visitas educativas para escolas e grupos da comunidade'],
                ['Pesquisa Zoológica', 'Apoio a pesquisas em zoologia e biodiversidade'],
            ]);
        }

        // HERBARIO
        if ($loc = $locations->get('Herbário')) {
            $this->cs($loc, 'Acervo Botânico', 'Coleção de amostras vegetais para pesquisa e ensino', 'Térreo', '07:00', '17:00', [
                ['Consulta ao Acervo', 'Acesso a amostras vegetais catalogadas da flora regional'],
                ['Pesquisa Botânica', 'Apoio a projetos de pesquisa em botânica e ecologia'],
                ['Identificação de Espécies', 'Serviço de identificação e classificação de plantas'],
            ]);
        }

        // TEATRO
        if ($loc = $locations->get('Teatro')) {
            $this->cs($loc, 'Palco e Plateia', 'Espaço para apresentações artísticas e eventos', 'Térreo', null, null, [
                ['Apresentações Artísticas', 'Peças teatrais, shows musicais e apresentações culturais'],
                ['Eventos Acadêmicos', 'Formaturas, colações de grau e cerimônias institucionais'],
                ['Palestras e Conferências', 'Eventos com palestrantes convidados e debates'],
            ]);
        }

        // ALMOXARIFADO
        if ($loc = $locations->get('Almoxarifado')) {
            $this->cs($loc, 'Almoxarifado Central', 'Recebimento, armazenamento e distribuição de materiais', 'Térreo', '07:00', '17:00', [
                ['Requisição de Material', 'Solicitação e retirada de materiais de consumo e expediente'],
                ['Recebimento de Mercadorias', 'Conferência e armazenamento de compras e doações'],
                ['Controle de Estoque', 'Inventário e gestão do estoque de materiais'],
            ]);
        }

        // TRANSPORTE
        if ($loc = $locations->get('Transporte')) {
            $this->cs($loc, 'Setor de Transporte', 'Coordenação de veículos e transporte institucional', 'Térreo', '07:00', '17:00', [
                ['Agendamento de Veículos', 'Reserva de veículos para atividades institucionais e aulas de campo'],
                ['Transporte Escolar', 'Apoio logístico ao transporte de alunos em atividades externas'],
            ]);
        }

        // OFICINA
        if ($loc = $locations->get('Oficina')) {
            $this->cs($loc, 'Oficina de Manutenção', 'Manutenção de equipamentos e infraestrutura', 'Térreo', '07:00', '17:00', [
                ['Manutenção Predial', 'Reparos elétricos, hidráulicos e estruturais'],
                ['Manutenção de Equipamentos', 'Reparo e conservação de máquinas e equipamentos agrícolas'],
            ]);
        }

        // AVIARIO
        if ($loc = $locations->get('Aviario')) {
            $this->cs($loc, 'Setor de Avicultura', 'Criação e manejo de aves', 'Térreo', '06:00', '17:00', [
                ['Manejo de Aves', 'Práticas de criação, alimentação e sanidade avícola'],
                ['Aulas Práticas de Avicultura', 'Aulas dos cursos técnicos em agropecuária'],
            ]);
        }

        // CAPRIL
        if ($loc = $locations->get('Capril')) {
            $this->cs($loc, 'Setor de Caprinocultura', 'Criação e manejo de caprinos', 'Térreo', '06:00', '17:00', [
                ['Manejo de Caprinos', 'Práticas de criação, reprodução e sanidade de caprinos'],
                ['Aulas Práticas', 'Aulas dos cursos da área agrária'],
            ]);
        }

        // ESTABULO
        if ($loc = $locations->get('Estábulo')) {
            $this->cs($loc, 'Setor de Bovinocultura', 'Criação e manejo de bovinos', 'Térreo', '05:00', '17:00', [
                ['Manejo de Bovinos', 'Práticas de criação, ordenha e sanidade bovina'],
                ['Aulas Práticas', 'Aulas dos cursos da área agrária'],
                ['Ordenha e Laticínios', 'Produção leiteira e encaminhamento para agroindústria'],
            ]);
        }

        // POCILGA
        if ($loc = $locations->get('Pocilga')) {
            $this->cs($loc, 'Setor de Suinocultura', 'Criação e manejo de suínos', 'Térreo', '06:00', '16:00', [
                ['Manejo de Suínos', 'Práticas de criação, reprodução e sanidade de suínos'],
                ['Aulas Práticas', 'Aulas dos cursos da área agrária'],
            ]);
        }

        // HORTA
        if ($loc = $locations->get('Horta')) {
            $this->cs($loc, 'Setor de Olericultura', 'Produção de hortaliças e legumes', 'Térreo', '07:00', '17:00', [
                ['Cultivo de Hortaliças', 'Plantio, manejo e colheita de hortaliças diversas'],
                ['Aulas Práticas', 'Práticas de campo para cursos agrários'],
            ]);
        }

        // VIVEIRO DE MUDAS
        if ($loc = $locations->get('Viveiro de Mudas')) {
            $this->cs($loc, 'Produção de Mudas', 'Produção de mudas nativas e exóticas', 'Térreo', '07:00', '17:00', [
                ['Produção de Mudas Florestais', 'Produção e distribuição de mudas de espécies nativas'],
                ['Aulas Práticas', 'Práticas de produção de mudas para cursos florestais'],
            ]);
        }

        // FABRICA DE RACAO
        if ($loc = $locations->get('Fábrica de Ração')) {
            $this->cs($loc, 'Produção de Ração Animal', 'Fabricação de ração para os setores de criação animal', 'Térreo', '07:00', '16:00', [
                ['Fabricação de Ração', 'Produção de ração balanceada para os rebanhos do campus'],
                ['Aulas Práticas de Nutrição Animal', 'Práticas sobre formulação e preparo de ração'],
            ]);
        }

        // CASA DE HOSPEDES
        if ($loc = $locations->get('Casa de Hóspedes')) {
            $this->cs($loc, 'Hospedagem', 'Alojamento para visitantes e servidores em trânsito', 'Térreo', null, null, [
                ['Hospedagem para Visitantes', 'Acomodação para palestrantes, bancas e visitantes institucionais'],
            ]);
        }

        // LANCHONETES
        if ($loc = $locations->get('Lanchonete I')) {
            $this->cs($loc, 'Lanchonete', 'Espaço comercial de alimentação', 'Térreo', '07:00', '21:00', [
                ['Venda de Lanches e Bebidas', 'Lanches, salgados, doces e bebidas para a comunidade'],
            ]);
        }
        if ($loc = $locations->get('Lanchonete II')) {
            $this->cs($loc, 'Lanchonete', 'Espaço comercial de alimentação', 'Térreo', '07:00', '21:00', [
                ['Venda de Lanches e Bebidas', 'Lanches, salgados, doces e bebidas para a comunidade'],
            ]);
        }

        // LOJA DE CONVENIENCIAS
        if ($loc = $locations->get('Loja de Conveniências')) {
            $this->cs($loc, 'Comércio', 'Loja de conveniências para a comunidade acadêmica', 'Térreo', '07:00', '21:00', [
                ['Venda de Produtos', 'Materiais escolares, produtos de higiene e conveniências em geral'],
            ]);
        }

        // ESPORTES
        if ($loc = $locations->get('Quadra de Futsal')) {
            $this->cs($loc, 'Quadra de Futsal', 'Quadra para prática de futsal', 'Térreo', '07:00', '22:00', [
                ['Prática Esportiva', 'Aulas de educação física e treinos de futsal'],
            ]);
        }
        if ($loc = $locations->get('Quadra de Basquete')) {
            $this->cs($loc, 'Quadra de Basquete', 'Quadra para prática de basquete', 'Térreo', '07:00', '22:00', [
                ['Prática Esportiva', 'Aulas de educação física e treinos de basquete'],
            ]);
        }
        if ($loc = $locations->get('Campo de Futebol')) {
            $this->cs($loc, 'Campo de Futebol', 'Campo gramado para prática de futebol', 'Térreo', '07:00', '18:00', [
                ['Prática Esportiva', 'Treinos e partidas de futebol'],
            ]);
        }
        if ($loc = $locations->get('Campo Society')) {
            $this->cs($loc, 'Campo Society', 'Campo sintético para prática de futebol society', 'Térreo', '07:00', '22:00', [
                ['Prática Esportiva', 'Treinos e partidas de futebol society'],
            ]);
        }
        if ($loc = $locations->get('Esporte e Lazer')) {
            $this->cs($loc, 'Área de Lazer', 'Espaço de esporte e lazer ao ar livre', 'Térreo', '07:00', '22:00', [
                ['Atividades Recreativas', 'Espaço para caminhadas, alongamento e atividades ao ar livre'],
                ['Eventos Esportivos', 'Competições e gincanas esportivas'],
            ]);
        }

        $this->command->info("\nSetores e servicos criados com sucesso!");
    }

    private function cs(Location $location, string $name, string $description, string $floor, ?string $openingTime, ?string $closingTime, array $services): void
    {
        $sector = Sector::create([
            'name' => $name,
            'description' => $description,
            'location_id' => $location->id,
            'floor' => $floor,
            'opening_time' => $openingTime,
            'closing_time' => $closingTime,
        ]);
        foreach ($services as [$sName, $sDesc]) {
            Service::create(['name' => $sName, 'description' => $sDesc, 'sector_id' => $sector->id]);
        }
        $this->command->info("  > {$location->name} > {$name} (".count($services).' servicos)');
    }
}
