import { format } from "date-fns";

function yearGet(dates) {
  // console.log("fun date", dates);
  // console.log(format(new Date(dates?.seconds * 1000), "yyyy"));
  return dates && format(new Date(dates.seconds * 1000), "yyyy");
}
export function groupBy(array) {
  return array.reduce((acc, curr) => {
    const groupKey = yearGet(curr.date);

    if (!acc.find((grp) => grp.key === groupKey)) {
      //       console.log(grp["date"]);
      acc.push({
        key: groupKey,
        items: [curr],
      });
    } else {
      acc.find((grp) => grp.key === groupKey).items.push(curr);
    }
    return acc;
  }, []);
}

export const lienDefault =
  "https://firebasestorage.googleapis.com/v0/b/maniv-a665b.appspot.com/o/logo-v2-variant-bg-noir.png?alt=media&token=a7f54c87-1d7b-4090-a87d-37a83d7a2e66";
