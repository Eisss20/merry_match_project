export function HobbyBlog(props) {
  return (
    <div className="hobby-blog h-[40px] rounded-xl border border-second-300 px-4 py-2 text-base font-normal text-second-600">
      {props.hobbyName}
    </div>
  );
}
