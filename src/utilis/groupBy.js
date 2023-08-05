import { format } from "date-fns/esm";

function yearGet(dates) {
  //   console.log("fun date", dates);
  //   console.log(format(new Date(dates?.seconds * 1000), "yyyy"));
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
