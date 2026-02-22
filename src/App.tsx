import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Utensils, 
  Clock, 
  Users, 
  ChefHat, 
  Heart, 
  Loader2, 
  Leaf,
  Sparkles,
  X,
  Calendar,
  Settings,
  ShoppingCart,
  Bell,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ChevronRight,
  Coffee,
  Sun,
  Moon,
  Info,
  Quote
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { generateWeeklyPlan, type FamilyMember, type WeeklyPlan, type Recipe, type DailyMenu } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEFAULT_FAMILY: FamilyMember[] = [
  { id: '1', name: 'Papá', age: 45, conditions: ['Adulto', 'Hígado Graso'], goals: ['Bajar de peso'] },
  { id: '2', name: 'Mamá', age: 42, conditions: ['Adulto', 'Diabetes'], goals: ['Control de glucosa'] },
  { id: '3', name: 'Hijo 1', age: 10, conditions: ['Niño'], goals: ['Crecimiento'] },
  { id: '4', name: 'Hijo 2', age: 7, conditions: ['Niño'], goals: ['Crecimiento'] },
  { id: '5', name: 'Abuelo', age: 70, conditions: ['Adulto', 'Hígado Graso'], goals: ['Mantenimiento'] },
];

type View = 'dashboard' | 'family' | 'planner' | 'shopping' | 'settings';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [family, setFamily] = useState<FamilyMember[]>(DEFAULT_FAMILY);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [preparedMeals, setPreparedMeals] = useState<Record<string, boolean>>({});
  const [eatenMeals, setEatenMeals] = useState<Record<string, boolean>>({});
  const [weekNumber, setWeekNumber] = useState(1);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [wakeUpTime, setWakeUpTime] = useState('06:00');
  const [mealTimes, setMealTimes] = useState({
    breakfast: '07:30',
    lunch: '12:30',
    dinner: '19:30',
    snack: '16:00'
  });

  const handleGeneratePlan = async (targetWeek?: number) => {
    setLoading(true);
    try {
      const plan = await generateWeeklyPlan(family, targetWeek || weekNumber);
      setWeeklyPlan(plan);
      setSelectedDayIndex(0);
      if (targetWeek) setWeekNumber(targetWeek);
      setView('planner');
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!weeklyPlan) {
      handleGeneratePlan();
    }
  }, [family, weekNumber]);

  const togglePrepared = (id: string) => {
    setPreparedMeals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleEaten = (id: string) => {
    setEatenMeals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <section className="bg-brand-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-serif mb-2">¡Hola, Familia!</h2>
          <p className="text-brand-bg/80 mb-6 italic">"Tu salud comienza en tu plato hoy."</p>
          <div className="flex gap-4">
            <button 
              onClick={() => setView('planner')}
              className="bg-white text-brand-primary px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2"
            >
              <Calendar size={18} /> Ver Menú de Hoy
            </button>
            <button 
              onClick={() => setView('shopping')}
              className="bg-brand-bg/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2"
            >
              <ShoppingCart size={18} /> Lista de Compras
            </button>
          </div>
        </div>
        <Sparkles className="absolute top-0 right-0 p-8 opacity-10" size={160} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
          <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
            <Users size={20} className="text-brand-primary" /> Perfil Familiar
          </h3>
          <div className="space-y-4">
            {family.map(member => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-brand-bg/30 rounded-2xl">
                <div>
                  <p className="font-bold text-stone-800">{member.name}</p>
                  <div className="flex gap-2 mt-1">
                    {member.conditions.map(c => (
                      <span key={c} className="text-[10px] bg-white px-2 py-0.5 rounded-full text-stone-500 border border-stone-100">{c}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setView('family')} className="text-brand-primary hover:bg-white p-2 rounded-full transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
          <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
            <Bell size={20} className="text-brand-primary" /> Próximas Alertas
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border-l-4 border-brand-secondary bg-brand-bg/20 rounded-r-2xl">
              <div className="p-3 bg-white rounded-xl text-brand-secondary">
                <Coffee size={20} />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Desayuno</p>
                <p className="font-bold text-stone-800">{mealTimes.breakfast} AM</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border-l-4 border-brand-accent bg-brand-bg/20 rounded-r-2xl">
              <div className="p-3 bg-white rounded-xl text-brand-accent">
                <Sun size={20} />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Almuerzo</p>
                <p className="font-bold text-stone-800">{mealTimes.lunch} PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFamily = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif">Configuración Familiar</h2>
        <button 
          onClick={() => {
            const newMember: FamilyMember = {
              id: Math.random().toString(36).substr(2, 9),
              name: 'Nuevo Miembro',
              age: 30,
              conditions: ['Adulto'],
              goals: []
            };
            setFamily([...family, newMember]);
          }}
          className="bg-brand-primary text-white p-3 rounded-full shadow-lg"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {family.map((member, idx) => (
          <motion.div 
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-grow space-y-4">
                <input 
                  className="text-2xl font-serif font-bold text-stone-800 bg-transparent border-b border-transparent focus:border-brand-primary outline-none w-full"
                  value={member.name}
                  onChange={(e) => {
                    const newFamily = [...family];
                    newFamily[idx].name = e.target.value;
                    setFamily(newFamily);
                  }}
                />
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold text-stone-400 uppercase">Edad</label>
                  <input 
                    type="number"
                    className="bg-brand-bg px-3 py-1 rounded-lg w-20 outline-none"
                    value={member.age}
                    onChange={(e) => {
                      const newFamily = [...family];
                      newFamily[idx].age = parseInt(e.target.value);
                      setFamily(newFamily);
                    }}
                  />
                </div>
              </div>
              <button 
                onClick={() => setFamily(family.filter(m => m.id !== member.id))}
                className="text-stone-300 hover:text-red-500 p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-xs font-bold text-stone-400 uppercase">Condiciones y Salud</p>
              <div className="flex flex-wrap gap-2">
                {['Diabetes', 'Hígado Graso', 'Niño', 'Adulto', 'Embarazo'].map(cond => (
                  <button
                    key={cond}
                    onClick={() => {
                      const newFamily = [...family];
                      const current = newFamily[idx].conditions;
                      if (current.includes(cond)) {
                        newFamily[idx].conditions = current.filter(c => c !== cond);
                      } else {
                        newFamily[idx].conditions = [...current, cond];
                      }
                      setFamily(newFamily);
                    }}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs transition-all",
                      member.conditions.includes(cond) 
                        ? "bg-brand-primary text-white" 
                        : "bg-brand-bg text-stone-500 hover:bg-stone-200"
                    )}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => handleGeneratePlan()}
          className="bg-brand-primary text-white px-10 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Sparkles size={20} /> Actualizar Plan Nutricional
        </button>
      </div>
    </div>
  );

  const renderPlanner = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-serif text-stone-800">Plan Semanal</h3>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-100 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-stone-400">Semana</span>
          <select 
            value={weekNumber} 
            onChange={(e) => handleGeneratePlan(parseInt(e.target.value))}
            className="bg-transparent font-bold text-brand-primary outline-none cursor-pointer"
          >
            {[1, 2, 3, 4].map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between overflow-x-auto pb-4 gap-4 scrollbar-hide">
        {[0, 1, 2, 3, 4].map(idx => (
          <button
            key={idx}
            onClick={() => setSelectedDayIndex(idx)}
            className={cn(
              "flex-shrink-0 w-20 h-24 rounded-3xl flex flex-col items-center justify-center transition-all",
              idx === selectedDayIndex ? "bg-brand-primary text-white shadow-lg" : "bg-white text-stone-400 border border-stone-100"
            )}
          >
            <span className="text-[10px] uppercase font-bold mb-1">Día</span>
            <span className="text-2xl font-serif font-bold">{idx + 1}</span>
          </button>
        ))}
      </div>

      {weeklyPlan?.days[selectedDayIndex] && (
        <div className="space-y-6">
          <h3 className="text-2xl font-serif text-stone-800 px-2">Menú del Día {selectedDayIndex + 1}</h3>
          
          {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
            const recipe = weeklyPlan.days[selectedDayIndex].meals[mealType];
            const mealId = `day${selectedDayIndex + 1}-${mealType}`;
            return (
              <MealCard 
                key={mealType}
                recipe={recipe}
                mealId={mealId}
                mealLabel={mealType === 'breakfast' ? 'Desayuno' : mealType === 'lunch' ? 'Almuerzo' : 'Cena'}
                prepared={preparedMeals[mealId]}
                eaten={eatenMeals[mealId]}
                onTogglePrepared={() => togglePrepared(mealId)}
                onToggleEaten={() => toggleEaten(mealId)}
                onViewRecipe={() => setSelectedRecipe(recipe)}
              />
            );
          })}

          {weeklyPlan.days[selectedDayIndex].meals.snacks.map((recipe, sIdx) => {
            const mealId = `day${selectedDayIndex + 1}-snack-${sIdx}`;
            return (
              <MealCard 
                key={mealId}
                recipe={recipe}
                mealId={mealId}
                mealLabel="Merienda"
                prepared={preparedMeals[mealId]}
                eaten={eatenMeals[mealId]}
                onTogglePrepared={() => togglePrepared(mealId)}
                onToggleEaten={() => toggleEaten(mealId)}
                onViewRecipe={() => setSelectedRecipe(recipe)}
              />
            );
          })}
        </div>
      )}
    </div>
  );

  const renderShopping = () => (
    <div className="space-y-8">
      <div className="bg-brand-primary rounded-[2.5rem] p-8 text-white">
        <h2 className="text-3xl font-serif mb-2">Lista de Compras</h2>
        <p className="text-brand-bg/80 text-sm">Semana {weekNumber} - Mercado Santa Cruz</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-8 space-y-6">
          {weeklyPlan?.shoppingList.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 py-4 border-b border-stone-50 last:border-0">
              <div className="w-6 h-6 rounded-lg border-2 border-stone-200 flex-shrink-0" />
              <div className="flex-grow">
                <p className="font-bold text-stone-800">{item.item}</p>
                <p className="text-xs text-stone-400 uppercase tracking-wider">{item.category}</p>
              </div>
              <span className="font-serif font-bold text-brand-primary">{item.amount}</span>
            </div>
          ))}
        </div>
      </div>
      
      <button className="w-full bg-brand-secondary text-white py-5 rounded-full font-bold shadow-lg flex items-center justify-center gap-2">
        <ShoppingCart size={20} /> Exportar Lista
      </button>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif">Configuración de Alertas</h2>
      
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-serif font-bold flex items-center gap-2">
            <Clock size={20} className="text-brand-primary" /> Horarios y Alarmas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Despertador (Comenzar a cocinar)</label>
              <input 
                type="time" 
                className="w-full bg-brand-primary/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary font-bold text-brand-primary"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
              />
            </div>
            {Object.entries(mealTimes).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{key}</label>
                <input 
                  type="time" 
                  className="w-full bg-brand-bg p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary"
                  value={value}
                  onChange={(e) => setMealTimes({...mealTimes, [key]: e.target.value})}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-stone-100" />

        <div className="space-y-6">
          <h3 className="text-lg font-serif font-bold flex items-center gap-2">
            <Bell size={20} className="text-brand-primary" /> Notificaciones
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-brand-bg/30 rounded-2xl">
              <div>
                <p className="font-bold text-stone-800">Alerta de Cocina</p>
                <p className="text-xs text-stone-500">Avisar 30 min antes de cada comida</p>
              </div>
              <div className="w-12 h-6 bg-brand-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-brand-bg/30 rounded-2xl">
              <div>
                <p className="font-bold text-stone-800">Resumen Nocturno</p>
                <p className="text-xs text-stone-500">Enviar menú del día siguiente a las 9 PM</p>
              </div>
              <div className="w-12 h-6 bg-brand-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg pb-32">
      {/* Top Bar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-stone-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-brand-primary p-2 rounded-xl text-white">
            <Utensils size={20} />
          </div>
          <h1 className="text-xl font-serif font-bold text-stone-900">Salud en tu Plato</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-stone-400 hover:text-brand-primary transition-colors">
            <Bell size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold">
            F
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="relative">
              <Loader2 className="animate-spin text-brand-primary" size={64} />
              <Sparkles className="absolute -top-4 -right-4 text-brand-accent animate-pulse" size={24} />
            </div>
            <div className="text-center space-y-2">
              <p className="text-2xl font-serif font-bold text-stone-800">Preparando tu plan personalizado</p>
              <p className="text-stone-500 italic">Adaptando ingredientes de Santa Cruz para tu familia...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'dashboard' && renderDashboard()}
              {view === 'family' && renderFamily()}
              {view === 'planner' && renderPlanner()}
              {view === 'shopping' && renderShopping()}
              {view === 'settings' && renderSettings()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-xl border border-stone-100 shadow-2xl rounded-full px-4 py-3 flex items-center gap-2">
        <NavButton active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<ChefHat size={20} />} label="Inicio" />
        <NavButton active={view === 'planner'} onClick={() => setView('planner')} icon={<Calendar size={20} />} label="Menú" />
        <NavButton active={view === 'shopping'} onClick={() => setView('shopping')} icon={<ShoppingCart size={20} />} label="Compras" />
        <NavButton active={view === 'family'} onClick={() => setView('family')} icon={<Users size={20} />} label="Familia" />
        <NavButton active={view === 'settings'} onClick={() => setView('settings')} icon={<Settings size={20} />} label="Ajustes" />
      </nav>

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-brand-bg w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-white/80 backdrop-blur-sm rounded-full text-stone-800 hover:bg-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="grid md:grid-cols-2">
                <div className="h-64 md:h-full relative">
                  <img 
                    src={`https://picsum.photos/seed/${selectedRecipe.title}/800/1200`} 
                    alt={selectedRecipe.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent md:hidden" />
                </div>

                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-2 text-brand-primary mb-4">
                    <Quote size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest">Motivación del Día</span>
                  </div>
                  <p className="text-stone-600 font-serif italic mb-8 text-lg leading-relaxed">
                    "{selectedRecipe.motivationalQuote}"
                  </p>

                  <h2 className="text-4xl font-serif font-bold text-stone-900 mb-6">
                    {selectedRecipe.title}
                  </h2>

                  <div className="flex gap-6 mb-8 py-4 border-y border-stone-200">
                    <div className="text-center">
                      <p className="text-[10px] uppercase text-stone-400 font-bold mb-1">Hora</p>
                      <p className="font-serif font-bold text-stone-800">{selectedRecipe.recommendedTime}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase text-stone-400 font-bold mb-1">Bebida</p>
                      <p className="font-serif font-bold text-stone-800">{selectedRecipe.suggestedDrink}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase text-stone-400 font-bold mb-1">Calorías</p>
                      <p className="font-serif font-bold text-stone-800">{selectedRecipe.nutritionalInfo.calories}</p>
                    </div>
                  </div>

                  <div className="mb-10 bg-white p-6 rounded-3xl border border-stone-100">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary mb-3 flex items-center gap-2">
                      <Info size={16} /> ¿Por qué es valioso?
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {selectedRecipe.nutritionalValueExplanation}
                    </p>
                  </div>

                  <div className="mb-10">
                    <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                      <Utensils size={18} className="text-brand-secondary" /> Ingredientes (para 5)
                    </h3>
                    <ul className="space-y-3">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex justify-between items-center text-stone-600 border-b border-stone-50 pb-2 last:border-0">
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                            {ing.item}
                          </span>
                          <span className="font-serif font-bold text-stone-800">{ing.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-10">
                    <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                      <Sparkles size={18} className="text-brand-secondary" /> Preparación
                    </h3>
                    <ol className="space-y-4">
                      {selectedRecipe.instructions.map((step, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-[10px] font-bold shrink-0 mt-1">
                            {i + 1}
                          </span>
                          <p className="text-stone-600 leading-relaxed">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-stone-100">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4">Valores Nutricionales</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <NutriStat label="Proteína" value={selectedRecipe.nutritionalInfo.protein} />
                      <NutriStat label="Carbos (Bajo IG)" value={selectedRecipe.nutritionalInfo.carbs} />
                      <NutriStat label="Grasas Saludables" value={selectedRecipe.nutritionalInfo.fats} />
                      <NutriStat label="Fibra" value={selectedRecipe.nutritionalInfo.fiber} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
        active ? "bg-brand-primary text-white shadow-lg" : "text-stone-400 hover:text-brand-primary hover:bg-brand-bg"
      )}
    >
      {icon}
      {active && <span className="text-xs font-bold uppercase tracking-widest">{label}</span>}
    </button>
  );
}

function NutriStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center p-3 bg-brand-bg rounded-2xl">
      <p className="text-[10px] text-stone-500 uppercase font-bold mb-1">{label}</p>
      <p className="font-serif font-bold text-brand-primary">{value}</p>
    </div>
  );
}

function MealCard({ 
  recipe, 
  mealId, 
  mealLabel, 
  prepared, 
  eaten, 
  onTogglePrepared, 
  onToggleEaten, 
  onViewRecipe 
}: { 
  recipe: Recipe, 
  mealId: string, 
  mealLabel: string, 
  prepared: boolean, 
  eaten: boolean, 
  onTogglePrepared: () => void, 
  onToggleEaten: () => void, 
  onViewRecipe: () => void 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-stone-100 flex flex-col md:flex-row"
    >
      <div className="md:w-48 h-48 bg-stone-100 relative shrink-0">
        <img 
          src={`https://picsum.photos/seed/${recipe.title}/400/400`} 
          alt={recipe.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-brand-primary uppercase">
          {mealLabel}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-xl font-serif font-bold text-stone-800">{recipe.title}</h4>
            <span className="text-xs font-bold text-brand-secondary">{recipe.recommendedTime}</span>
          </div>
          <p className="text-stone-500 text-sm italic mb-4 line-clamp-2">{recipe.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button 
              onClick={onTogglePrepared}
              className={cn(
                "flex items-center gap-2 text-xs font-bold transition-colors",
                prepared ? "text-green-600" : "text-stone-400"
              )}
            >
              <CheckCircle2 size={16} /> Preparado
            </button>
            <button 
              onClick={onToggleEaten}
              className={cn(
                "flex items-center gap-2 text-xs font-bold transition-colors",
                eaten ? "text-brand-primary" : "text-stone-400"
              )}
            >
              <Utensils size={16} /> Comido
            </button>
          </div>
          <button 
            onClick={onViewRecipe}
            className="text-brand-primary font-bold text-xs flex items-center gap-1 hover:underline"
          >
            Ver Receta <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
