// src/pages/Dashboard.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // <<-- 1. IMPORTAÇÃO DO BOTÃO ADICIONADA
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AlertCircle, ArrowUpRight, Sun, Leaf, Users } from "lucide-react";

// --- DADOS SIMULADOS PARA OS GRÁFICOS E TABELA ---

const no2Data = [
    { name: 'Centro', nivel: 45, ideal: 20 },
    { name: 'Zona Leste', nivel: 62, ideal: 20 },
    { name: 'Zona Sul', nivel: 38, ideal: 20 },
    { name: 'Zona Norte', nivel: 55, ideal: 20 },
    { name: 'Zona Oeste', nivel: 32, ideal: 20 },
];

const temperatureData = [
    { month: 'Jan', media: 28 }, { month: 'Fev', media: 29 }, { month: 'Mar', media: 27 },
    { month: 'Abr', media: 25 }, { month: 'Mai', media: 22 }, { month: 'Jun', media: 21 },
];

const projectsData = [
    { id: 'PROJ-001', area: 'Centro', status: 'Em Análise', prioridade: 'Alta' },
    { id: 'PROJ-002', area: 'Zona Leste', status: 'Aprovado', prioridade: 'Alta' },
    { id: 'PROJ-003', area: 'Tatuapé', status: 'Planejamento', prioridade: 'Média' },
    { id: 'PROJ-004', area: 'Pinheiros', status: 'Concluído', prioridade: 'Baixa' },
];

const Dashboard = () => {
    return (
        <div className="min-h-screen flex flex-col bg-muted/40">
            <Navbar />
            <main className="flex-1 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4">Painel do Gestor</h1>

                    {/* Cards de Resumo (KPIs) */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Nível Médio de NO₂</CardTitle>
                                <AlertCircle className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-destructive">48 µg/m³</div>
                                <p className="text-xs text-muted-foreground">+20% vs. mês passado</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pontos de Calor Críticos</CardTitle>
                                <Sun className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-500">12 áreas</div>
                                {/* 2. CORREÇÃO DO SINAL DE MAIOR (>) */}
                                <p className="text-xs text-muted-foreground">{'Temperatura > 5°C da média'}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Cobertura Verde</CardTitle>
                                <Leaf className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">18.2%</div>
                                <p className="text-xs text-muted-foreground">Meta 2030: 25%</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">População em Risco</CardTitle>
                                <Users className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">2.4 Milhões</div>
                                <p className="text-xs text-muted-foreground">Expostos a poluição elevada</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Gráfico de Poluição por Região */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Níveis de Poluição (NO₂) por Região</CardTitle>
                                <CardDescription>Média dos últimos 30 dias</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={no2Data}>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                                        <YAxis stroke="#888888" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                                        <Bar dataKey="nivel" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Nível Atual" />
                                        <Bar dataKey="ideal" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Nível Ideal" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Gráfico de Temperatura Média */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Média de Temperatura Mensal</CardTitle>
                                <CardDescription>Aumento indica intensificação das ilhas de calor</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={temperatureData}>
                                        <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                                        <YAxis stroke="#888888" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                                        <Line type="monotone" dataKey="media" stroke="hsl(var(--primary))" strokeWidth={2} name="Média (°C)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabela de Projetos */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Projetos e Intervenções</CardTitle>
                            <CardDescription>Status dos projetos de instalação de Árvores Líquidas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID do Projeto</TableHead>
                                        <TableHead>Área</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Prioridade</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projectsData.map((proj) => (
                                        <TableRow key={proj.id}>
                                            <TableCell className="font-medium">{proj.id}</TableCell>
                                            <TableCell>{proj.area}</TableCell>
                                            <TableCell>
                                                <Badge variant={proj.status === 'Aprovado' ? 'default' : proj.status === 'Concluído' ? 'secondary' : 'outline'}>
                                                    {proj.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={proj.prioridade === 'Alta' ? 'destructive' : 'secondary'}>
                                                    {proj.prioridade}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;