export default function CardSection() {
  const steps = [
    {
      emoji: "😎",
      title: "Upload your cool picture",
      description: "Lorem ipsum is a placeholder text",
    },
    {
      emoji: "😁",
      title: "Explore and find the one you like",
      description: "Lorem ipsum is a placeholder text",
    },
    {
      emoji: "🥳",
      title: "Click 'Merry' for get to know!",
      description: "Lorem ipsum is a placeholder text",
    },
    {
      emoji: "😘",
      title: "Start chatting and  relationship",
      description: "Lorem ipsum is a placeholder text",
    },
  ];

  return (
    <>
      {/* renderlists */}
      <div
        id="HowToMerrySection"
        className="bg-utility-bg p-6 text-white lg:p-0 lg:py-24"
      >
        <h2 className="mb-8 text-center text-4xl font-extrabold text-second-300">
          How to Merry
        </h2>
        <figure className="container mx-auto flex flex-col items-center space-y-6 lg:flex-row lg:justify-center lg:gap-5 lg:space-y-0">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex w-full flex-col items-center rounded-badge bg-second-800 p-10 lg:w-[15rem]"
            >
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-second-600 text-4xl">
                <span className="text-center">{step.emoji}</span>
              </div>
              <article className="mt-5 text-center">
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-gray-300">{step.description}</p>
              </article>
            </div>
          ))}
        </figure>
      </div>
    </>
  );
}
