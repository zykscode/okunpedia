'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { CounterValidation } from '@/validations/CounterValidation';
import { Button } from '@/components/ui/Button';

export const CounterForm = () => {
  const form = useForm({
    resolver: zodResolver(CounterValidation),
    defaultValues: {
      increment: 1,
    },
  });
  const router = useRouter();

  const handleIncrement = form.handleSubmit(async (formData) => {
    const response = await fetch(`/api/counter`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    await response.json();

    router.refresh();
  });

  return (
    <form onSubmit={handleIncrement} className="space-y-4">
      <p className="text-xs text-gray-600 dark:text-gray-400">Increment the shared counter below:</p>
      <div>
        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5" htmlFor="increment">
          Increment By
        </label>
        <input
          id="increment"
          type="number"
          className="w-32 appearance-none rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 focus:ring-2 focus:ring-blue-300 focus:outline-hidden dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
          {...form.register('increment', { valueAsNumber: true })}
        />

        {form.formState.errors.increment && (
          <div className="my-2 text-xs text-red-500 italic">Please enter a valid positive increment value.</div>
        )}
      </div>

      <div className="pt-2">
        <Button
          variant="primary"
          size="sm"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Incrementing...' : 'Increment'}
        </Button>
      </div>
    </form>
  );
};
