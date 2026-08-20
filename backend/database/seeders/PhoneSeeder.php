<?php

namespace Database\Seeders;

use App\Models\Phone;
use Illuminate\Database\Seeder;

class PhoneSeeder extends Seeder
{
    public function run(): void
    {
        $phones = [
            ['contact_name' => 'Flávio Rocha Puff', 'contact_position' => 'Diretor Geral', 'contact_email' => 'flavio.puff@ifmg.edu.br', 'number' => '(33) 3412-2907', 'order' => 1],
            ['contact_name' => 'Bruno Pedro de Nazareth Nazário', 'contact_position' => 'Chefe do Setor de Assuntos Institucionais, Comunicação e Eventos', 'contact_email' => 'assuntosinstitucionais.sje@ifmg.edu.br', 'number' => '(33) 3412-2906', 'order' => 2],
            ['contact_name' => 'Ioná Braga de Castro Pereira', 'contact_position' => 'Chefe do Setor de Gestão de Pessoas', 'contact_email' => 'gestaodepessoas.sje@ifmg.edu.br', 'number' => '(33) 3412-2909', 'order' => 3],
            ['contact_name' => 'Marcelo Miranda', 'contact_position' => 'Chefe do Setor de Tecnologia da Informação', 'contact_email' => 'ti.sje@ifmg.edu.br', 'number' => '(33) 3412-2912', 'order' => 4],
            ['contact_name' => 'Ana Carolina Ferraro', 'contact_position' => 'Chefe da Seção de Pesquisa, Inovação e Pós-Graduação', 'contact_email' => 'pesquisa.sje@ifmg.edu.br', 'number' => '(33) 3412-2900', 'order' => 5],
            ['contact_name' => 'José Leonardo de Oliveira Rodrigues', 'contact_position' => 'Chefe da Seção de Extensão, Esporte e Cultura', 'contact_email' => 'extensao.sje@ifmg.edu.br', 'number' => '(33) 3412-2934', 'order' => 6],
            ['contact_name' => 'Anderson Nascimento Oliveira', 'contact_position' => 'Diretor de Administração e Planejamento', 'contact_email' => 'dap.sje@ifmg.edu.br', 'number' => '(33) 3412-2902', 'order' => 7],
            ['contact_name' => 'Antônio Vieira Lima', 'contact_position' => 'Coordenador de Administração', 'contact_email' => 'cadm.sje@ifmg.edu.br', 'number' => '(33) 3412-2955', 'order' => 8],
            ['contact_name' => 'José Raimundo Lopes', 'contact_position' => 'Chefe da Seção de Logística e Mecanização', 'contact_email' => 'transportes.sje@ifmg.edu.br', 'number' => '(33) 3412-2931', 'order' => 9],
            ['contact_name' => 'Damião Rocha Noel', 'contact_position' => 'Chefe do Setor de Planejamento, Finanças e Contabilidade', 'contact_email' => 'planejamento.sje@ifmg.edu.br', 'number' => '(33) 3412-2903', 'order' => 10],
            ['contact_name' => 'Getro Menezes Leão', 'contact_position' => 'Responsável pelo Núcleo de Contabilidade', 'contact_email' => 'financeiro.sje@ifmg.edu.br', 'number' => '(33) 3412-2946', 'order' => 11],
            ['contact_name' => 'Amauri Menezes Leal', 'contact_position' => 'Responsável pelo Núcleo de Contratos', 'contact_email' => 'contratos.sje@ifmg.edu.br', 'number' => '(33) 3412-2958', 'order' => 12],
            ['contact_name' => 'Marcos Vinicios Lopes de Souza', 'contact_position' => 'Responsável pelo Núcleo de Execução Financeira', 'contact_email' => 'financeiro.sje@ifmg.edu.br', 'number' => '(33) 3412-2965', 'order' => 13],
            ['contact_name' => 'Gracilane Elinaide de Lima', 'contact_position' => 'Chefe da Seção de Planejamentos e Compras', 'contact_email' => 'planejamento.sje@ifmg.edu.br', 'number' => '(33) 3412-2920', 'label' => 'compras.sje@ifmg.edu.br', 'order' => 14],
            ['contact_name' => 'Bruno Magno Moreira', 'contact_position' => 'Chefe da Seção de Projetos de Produção Agrícola', 'contact_email' => 'bruno.moreira@ifmg.edu.br', 'number' => '(33) 3412-2914', 'order' => 15],
            ['contact_name' => 'Aparecido Weyne Lavor', 'contact_position' => 'Chefe da Seção de Projetos de Produção Animal', 'contact_email' => 'aparecido.lavor@ifmg.edu.br', 'number' => '(33) 3412-2914', 'order' => 16],
            ['contact_name' => 'Sandro Salles Gonçalves', 'contact_position' => 'Diretor de Ensino', 'contact_email' => 'de.sje@ifmg.edu.br', 'number' => '(33) 3412-2939', 'order' => 17],
            ['contact_name' => 'Derli Barbosa dos Santos', 'contact_position' => 'Coordenador do Núcleo de Atendimento à Pessoas com Necessidades Especiais', 'contact_email' => 'napne.sje@ifmg.edu.br', 'number' => '(33) 3412-2963', 'order' => 18],
            ['contact_name' => 'Ezilene Pereira da Costa', 'contact_position' => 'Coordenadora de Assuntos Estudantis', 'contact_email' => 'assuntosestudantis.sje@ifmg.edu.br', 'number' => '(33) 3412-2948', 'order' => 19],
            ['contact_name' => 'Sueli de França Nascimento', 'contact_position' => 'Chefe da Seção de Moradia Estudantil', 'contact_email' => 'alojamento.sje@ifmg.edu.br', 'number' => '(33) 3412-2930', 'label' => 'Ramal: (33) 3412-2951', 'order' => 20],
            ['contact_name' => 'Douglas Biagio Puglia', 'contact_position' => 'Coordenador de Ensino Médio e Técnico', 'contact_email' => 'cemt.sje@ifmg.edu.br', 'number' => '(33) 3412-2936', 'order' => 21],
            ['contact_name' => 'Fabiano Moreira da Silva', 'contact_position' => 'Responsável pelo Núcleo de Apoio ao Ensino Médio', 'contact_email' => 'naem.sje@ifmg.edu.br', 'number' => '(33) 3412-2936', 'order' => 22],
            ['contact_name' => 'Giuslan Carvalho Pereira', 'contact_position' => 'Coordenador de Ensino Superior', 'contact_email' => 'ces.sje@ifmg.edu.br', 'number' => '(33) 3412-2922', 'order' => 23],
            ['contact_name' => 'Paulo Sérgio Pereira', 'contact_position' => 'Chefe da Seção de Controle e Registro Acadêmico', 'contact_email' => 'secretaria.sje@ifmg.edu.br', 'number' => '(33) 3412-2910', 'order' => 24],
            ['contact_name' => 'Lucas Barros Souza', 'contact_position' => 'Responsável pelo Núcleo de Laboratórios de Ciências Agrárias', 'number' => '(33) 3412-2919', 'order' => 25],
            ['contact_name' => 'Célio Medina Gonçalo', 'contact_position' => 'Responsável pelo Núcleo de Internacionalização', 'number' => '(33) 3412-2900', 'order' => 26],
            ['contact_name' => 'Ricardo Gomes de Oliveira', 'contact_position' => 'Responsável pelo Núcleo de Inovação', 'number' => '(33) 3412-2919', 'order' => 27],
            ['contact_name' => 'José Borges Gonçalves', 'contact_position' => 'Responsável pelo Núcleo de Transportes', 'contact_email' => 'transportes.sje@ifmg.edu.br', 'number' => '(33) 3412-2931', 'order' => 28],
            ['contact_name' => 'Wálmisson Régis de Almeida', 'contact_position' => 'Responsável pelo Núcleo de Educação a Distância', 'number' => '(33) 3412-2900', 'order' => 29],
            ['contact_name' => 'Antônio Augusto Cândido', 'contact_position' => 'Responsável pelo Núcleo de Almoxarifado', 'contact_email' => 'almoxarifado.sje@ifmg.edu.br', 'number' => '(33) 3412-2915', 'order' => 30],
            ['contact_name' => 'José Fernandes da Silva', 'contact_position' => 'Responsável pelo Núcleo de Pós-Graduação', 'number' => '(33) 3412-2900', 'order' => 31],
            ['contact_name' => 'Márcia Ferreira da Silva', 'contact_position' => 'Responsável pelo Núcleo de Esporte e Lazer', 'contact_email' => 'esportes.sje@ifmg.edu.br', 'number' => '(33) 3412-2949', 'order' => 32],
            ['contact_name' => 'Rafael Eugênio Maia Guanabens', 'contact_position' => 'Responsável pelo Núcleo de Apoio Agrícola ao Ensino, Pesquisa e Extensão', 'number' => '(33) 3412-2981', 'order' => 33],
            ['contact_name' => 'Esther Soares Cunha', 'contact_position' => 'Responsável pelo Núcleo de Biblioteca', 'contact_email' => 'biblioteca.sje@ifmg.edu.br', 'number' => '(33) 3412-2932', 'order' => 34],
            ['contact_name' => 'Rafael Sodré de Castro', 'contact_position' => 'Responsável pelo Núcleo de Arte e Cultura', 'number' => '(33) 3412-2900', 'order' => 35],
            ['contact_name' => 'Waldeck Campanha de Souza Junior', 'contact_position' => 'Responsável pelo Núcleo de Agroindústria', 'number' => '(33) 3412-2942', 'order' => 36],
            ['contact_name' => 'Shirlene Consuelo Alves Barbosa', 'contact_position' => 'Responsável pelo Núcleo de Relações Comunitárias', 'contact_email' => 'extensao.sje@ifmg.edu.br', 'number' => '(33) 3412-2934', 'order' => 37],
        ];

        foreach ($phones as $phone) {
            Phone::create($phone);
        }
    }
}
