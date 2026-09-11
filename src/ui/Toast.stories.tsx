import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useToast } from "./ToastContext";
import { Button } from "./Button";

function ToastDemo() {
  const { showToast, confirmAction } = useToast();

  const handleConfirm = async () => {
    const ok = await confirmAction({
      title: "Eliminar Documento?",
      message: "Esta ação é irreversível e removerá todas as secções permanentemente.",
      confirmText: "Sim, eliminar",
      cancelText: "Voltar atrás",
      danger: true,
    });

    if (ok) {
      showToast("Documento eliminado com sucesso.", "error");
    } else {
      showToast("Ação cancelada pelo utilizador.", "info");
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md p-6 bg-white dark:bg-[#161b22] rounded-3xl border border-stone-200 dark:border-[#30363d] shadow-xl">
      <h3 className="text-sm font-bold text-stone-800 dark:text-[#f0f3f6]">
        Disparador Interativo de Notificações
      </h3>
      <p className="text-xs text-stone-500 dark:text-[#8b949e]">
        Testa as notificações flutuantes e o diálogo assíncrono de confirmação com suporte à tecla Escape.
      </p>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          variant="secondary"
          onClick={() => showToast("Alterações guardadas automaticamente.", "success")}
        >
          Toast Sucesso
        </Button>
        <Button
          variant="secondary"
          onClick={() => showToast("Falha ao exportar ficheiro LaTeX.", "error")}
        >
          Toast Erro
        </Button>
        <Button
          variant="secondary"
          onClick={() => showToast("Nova versão do perfil carregada.", "info")}
        >
          Toast Info
        </Button>
      </div>

      <div className="pt-2 border-t border-stone-100 dark:border-[#21262d]">
        <Button variant="danger" onClick={handleConfirm} className="w-full">
          Abrir Confirmação Assíncrona
        </Button>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "UI/Toast & ConfirmDialog",
  component: ToastDemo,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ToastDemo />,
};
