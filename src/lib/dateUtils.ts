import { addBusinessDays, differenceInBusinessDays, isWeekend, startOfDay } from 'date-fns';

/**
 * Calcula quantos dias úteis restam de um prazo de X dias úteis a partir de uma data inicial.
 * @param startDate Data de início (ex: quando o ensaio foi realizado/finalizado)
 * @param deadlineBusinessDays Prazo em dias úteis (ex: 7)
 * @returns Número de dias úteis restantes
 */
export function calculateRemainingBusinessDays(startDate: Date | string, deadlineBusinessDays: number = 7): number {
  const start = startOfDay(new Date(startDate));
  const today = startOfDay(new Date());

  // Calcula a data de vencimento (deadline) adicionando X dias úteis
  const deadlineDate = addBusinessDays(start, deadlineBusinessDays);

  // Calcula a diferença em dias úteis entre hoje e a data de vencimento
  // Se hoje for após a deadline, o resultado será negativo
  const remaining = differenceInBusinessDays(deadlineDate, today);

  return remaining;
}

/**
 * Formata a mensagem do cronômetro
 */
export function getCountdownMessage(startDate: Date | string, deadlineBusinessDays: number = 7): { message: string; color: string } {
  const remaining = calculateRemainingBusinessDays(startDate, deadlineBusinessDays);

  if (remaining < 0) {
    return {
      message: `Atrasado há ${Math.abs(remaining)} dia${Math.abs(remaining) !== 1 ? 's' : ''} útil${Math.abs(remaining) !== 1 ? 'eis' : ''}`,
      color: 'text-red-600 dark:text-red-400'
    };
  }

  if (remaining === 0) {
    return {
      message: 'Vence hoje!',
      color: 'text-orange-600 dark:text-orange-400 font-bold'
    };
  }

  return {
    message: `${remaining} dia${remaining !== 1 ? 's' : ''} útil${remaining !== 1 ? 'eis' : ''} restante${remaining !== 1 ? 's' : ''}`,
    color: 'text-slate-500 dark:text-slate-400'
  };
}
