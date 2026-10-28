import React, { useState } from 'react';
import { useOnlineStatus, usePWAInstall } from '../game/usePWAInstall';
import { playFx } from '../game/audio';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-[#FBF0C9] border-[2.5px] border-[#231F20] px-3.5 py-2 text-xs font-extrabold text-[#231F20] shadow-[0_3px_0_#231F20]"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-[#E67E22] animate-pulse border border-[#231F20]" />
      Offline Mode — Игра работает офлайн из кеша
    </div>
  );
};

export const PWAInstallButton: React.FC<{
  variant?: 'title' | 'modal';
}> = ({ variant = 'title' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    playFx('menu');
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur();
          void handleInstallClick();
        }}
        className={
          variant === 'title'
            ? 'flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#BCE879] hover:bg-[#A8DC5E] border-[3.5px] border-[#231F20] font-display font-bold text-base text-[#231F20] shadow-[0_5px_0_#231F20] active:translate-y-0.5 transition-transform whitespace-nowrap shrink-0 cursor-pointer'
            : 'flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#BCE879] hover:bg-[#A8DC5E] border-[2.5px] border-[#231F20] font-bold text-xs text-[#231F20] shadow-[0_3px_0_#231F20] whitespace-nowrap shrink-0 cursor-pointer'
        }
      >
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>
          {isInstallable
            ? 'Install Android / App'
            : isIOS
              ? 'Install on iOS'
              : 'Android / APK App'}
        </span>
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto"
          style={{ backgroundColor: 'rgba(43, 33, 24, 0.55)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Установка на Android и сборка APK"
        >
          <div className="w-full max-w-lg rounded-3xl bg-[#FFF7ED] border-[4px] border-[#231F20] p-6 shadow-[0_10px_0_#231F20] text-left">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <img
                  src="/icon.svg"
                  alt="Fairy Haven Icon"
                  className="w-12 h-12 rounded-2xl border-[2.5px] border-[#231F20]"
                />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5A7B44]">
                    PWA READY · OFFLINE ENABLED
                  </span>
                  <h3 className="text-xl font-display font-bold text-[#231F20]">
                    Установка на Android и сборка APK
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-3.5 py-1.5 rounded-xl bg-[#FCE1D8] border-[2.5px] border-[#231F20] font-bold text-xs text-[#231F20] hover:bg-[#F9CBB8] cursor-pointer"
              >
                Закрыть
              </button>
            </div>

            {isIOS ? (
              <div className="p-4 rounded-2xl bg-[#FFFDF9] border-[2.5px] border-[#231F20] text-sm text-[#4A372B] space-y-2">
                <p className="font-bold text-[#231F20]">Установка на iPhone / iPad:</p>
                <p>1. Нажмите кнопку <strong>Поделиться (Share)</strong> в нижней панели Safari.</p>
                <p>2. Выберите <strong>«На экран «Домой»» (Add to Home Screen)</strong>.</p>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm text-[#4A372B]">
                <div className="p-3.5 rounded-2xl bg-[#E2F4EE] border-[2.5px] border-[#231F20]">
                  <div className="font-display font-bold text-[#231F20] mb-1">
                    1. Прямая установка на телефон Android (без Google Play)
                  </div>
                  <p>
                    Откройте опубликованную ссылку приложения в браузере <strong>Chrome на Android</strong> (в отдельной вкладке вне предпросмотра) и нажмите <strong>«Установить приложение»</strong> (или меню ⋮ → <em>«Добавить на гл. экран»</em>).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FBF0C9] border-[2.5px] border-[#231F20]">
                  <div className="font-display font-bold text-[#231F20] mb-1">
                    2. Сборка готового .APK и .AAB для Google Play
                  </div>
                  <p>
                    В проект уже встроены <strong>Web App Manifest</strong>, <strong>Service Worker (офлайн-кеш)</strong> и <strong>маскируемые иконки 192×192 / 512×512</strong>. Вставьте публичную ссылку на игру на сайте <strong>PWABuilder.com</strong> → нажмите <strong>Package for stores → Android</strong>, чтобы за 1 минуту скачать готовый <code>.apk</code> и <code>.aab</code>.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2.5 rounded-2xl bg-[#BCE879] hover:bg-[#A8DC5E] border-[3px] border-[#231F20] font-display font-bold text-sm text-[#231F20] shadow-[0_4px_0_#231F20] cursor-pointer"
              >
                Понятно!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
