export default function DashboardPage() {
  return (
    <div className="py-24 bg-gray-50 sm:py-32">
      <div className="max-w-2xl px-6 mx-auto lg:max-w-7xl lg:px-8">
        <h2 className="font-semibold text-center text-indigo-600 text-base/7">
          Deploy faster
        </h2>
        <p className="max-w-lg mx-auto mt-2 text-4xl font-semibold tracking-tight text-center text-balance text-gray-950 sm:text-5xl">
          Everything you need to deploy your app
        </p>
        <div className="grid gap-4 mt-10 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          <div className="relative lg:row-span-2">
            <div className="absolute bg-white rounded-lg inset-px lg:rounded-l-4xl" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Mobile friendly
                </p>
                <p className="max-w-lg mt-2 text-gray-600 text-sm/6 max-lg:text-center">
                  Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure
                  qui lorem cupidatat commodo.
                </p>
              </div>
              <div className="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                  <img
                    alt=""
                    src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-mobile-friendly.png"
                    className="object-cover object-top size-full"
                  />
                </div>
              </div>
            </div>
            <div className="absolute rounded-lg shadow-sm pointer-events-none inset-px outline outline-black/5 lg:rounded-l-4xl" />
          </div>
          <div className="relative max-lg:row-start-1">
            <div className="absolute bg-white rounded-lg inset-px max-lg:rounded-t-4xl" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Performance
                </p>
                <p className="max-w-lg mt-2 text-gray-600 text-sm/6 max-lg:text-center">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit
                  maiores impedit.
                </p>
              </div>
              <div className="flex items-center justify-center flex-1 px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png"
                  className="w-full max-lg:max-w-xs"
                />
              </div>
            </div>
            <div className="absolute rounded-lg shadow-sm pointer-events-none inset-px outline outline-black/5 max-lg:rounded-t-4xl" />
          </div>
          <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
            <div className="absolute bg-white rounded-lg inset-px" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Security
                </p>
                <p className="max-w-lg mt-2 text-gray-600 text-sm/6 max-lg:text-center">
                  Morbi viverra dui mi arcu sed. Tellus semper adipiscing
                  suspendisse semper morbi.
                </p>
              </div>
              <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                  className="h-[min(152px,40cqw)] object-cover"
                />
              </div>
            </div>
            <div className="absolute rounded-lg shadow-sm pointer-events-none inset-px outline outline-black/5" />
          </div>
          <div className="relative lg:row-span-2">
            <div className="absolute bg-white rounded-lg inset-px max-lg:rounded-b-4xl lg:rounded-r-4xl" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Recent Activities
                </p>
                <p className="max-w-lg mt-2 text-gray-600 text-sm/6 max-lg:text-center">
                  {/* Sit quis amet rutrum tellus ullamcorper ultricies libero dolor
                  eget sem sodales gravida. */}
                </p>
              </div>
              <div className="relative w-full min-h-120 grow">
                <div className="absolute bottom-0 right-0 overflow-hidden bg-gray-900 shadow-2xl top-10 left-10 rounded-tl-xl outline outline-white/10">
                  <div className="flex bg-gray-900 outline outline-white/5">
                    <div className="flex -mb-px font-medium text-gray-400 text-sm/6">
                      <div className="px-4 py-2 text-white border-b border-r border-r-white/10 border-b-white/20 bg-white/5">
                        NotificationSetting.jsx
                      </div>
                      <div className="px-4 py-2 border-r border-gray-600/10">
                        App.jsx
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-14">
                    {/* Your code example */}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute rounded-lg shadow-sm pointer-events-none inset-px outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
