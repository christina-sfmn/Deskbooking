import { FixDeskView } from "./FixDeskView";
import { CommentView } from "./CommentView";
import { AddOfficeView } from "./AddOfficeView";
import { AddDeskView } from "./AddDeskView";

export const AdministrationPage = () => {
  return (
    <>
      <h1>Administrator</h1>
      <FixDeskView />
      <CommentView />
      <AddOfficeView />
      <AddDeskView />
    </>
  );
};
