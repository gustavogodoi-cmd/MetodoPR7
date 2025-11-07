import React from 'react';
import { BarChart2, Users, PlusCircle, Upload } from './icons';

interface HeaderProps {
    onAddNewRecord: () => void;
    currentView: 'dashboard' | 'students';
    onSetView: (view: 'dashboard' | 'students') => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddNewRecord, currentView, onSetView }) => {
    const navItemClasses = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClasses = "bg-gray-700 text-white";
    const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

    const handleImportClick = () => {
        alert('Para adicionar novos alunos, inclua-os na planilha do Google Sheets conectada ao formulário. O painel será atualizado automaticamente.');
    };

    return (
        <header className="bg-gray-800 shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-xl md:text-2xl font-bold text-white">
                            Validador de Presença – Painel de Treinos
                        </h1>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={() => onSetView('dashboard')}
                            className={`${navItemClasses} ${currentView === 'dashboard' ? activeClasses : inactiveClasses}`}
                        >
                            <BarChart2 className="w-5 h-5" />
                            <span>Dashboard</span>
                        </button>
                        <button
                            onClick={() => onSetView('students')}
                            className={`${navItemClasses} ${currentView === 'students' ? activeClasses : inactiveClasses}`}
                        >
                            <Users className="w-5 h-5" />
                            <span>Alunos</span>
                        </button>
                         <button 
                            onClick={handleImportClick}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md font-medium transition-colors"
                            aria-label="Importar novos alunos"
                        >
                           <Upload className="w-5 h-5" />
                            Importar Alunos
                        </button>
                        <button 
                            onClick={onAddNewRecord}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
                            aria-label="Simular nova presença"
                        >
                           <PlusCircle className="w-5 h-5" />
                            Simular Nova Presença
                        </button>
                    </div>
                     <div className="md:hidden flex items-center space-x-2">
                        <button onClick={() => onSetView('dashboard')} className={`${currentView === 'dashboard' ? 'text-indigo-400' : 'text-gray-400'}`} aria-label="Ver dashboard">
                            <BarChart2 className="w-6 h-6" />
                        </button>
                         <button onClick={() => onSetView('students')} className={`${currentView === 'students' ? 'text-indigo-400' : 'text-gray-400'}`} aria-label="Ver lista de alunos">
                            <Users className="w-6 h-6" />
                        </button>
                        <button onClick={handleImportClick} className="text-gray-400" aria-label="Importar alunos">
                           <Upload className="w-6 h-6" />
                        </button>
                        <button onClick={onAddNewRecord} className="text-indigo-400" aria-label="Simular nova presença">
                           <PlusCircle className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};