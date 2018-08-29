import * as _ from 'partial-js';
import { BehaviorSubject, Observable, observable, fromEvent } from 'rxjs';
import { appendToSubject, createChild, FILTER_BASE } from './codeSnippet';

const $ = document.addEventListener;
const qs = document.querySelector.bind(document);

$("DOMContentLoaded", e => {
  console.log("DOMLoaded");
  // 상태정의, CELL 개념
  const hash = new BehaviorSubject("");
  const things = new BehaviorSubject([]);
  const viewList = new BehaviorSubject([]);
  // 자주쓰는 Element
  const list = qs(".todo-list");
  const redoThings = () => { things.next(things.getValue()) };

  viewList.subscribe(_.each(item => list.appendChild(item.el)));
  things.subscribe(
    _.pipe(
      val => {
        list.innerHTML = "";
        return val;
      },
      _.filter(item => (hash.getValue() === "") ?
        true : item.checked === FILTER_BASE[hash.getValue()]),
        viewList.next.bind(viewList)
    )
  );
  hash.subscribe(redoThings);

  const sChangeHash = fromEvent(window, "hashchange").subscribe(
    () => {
      const hashPath = location.hash.replace("#/", "");

      hash.next(hashPath);
    }
  );

  qs(".new-todo").addEventListener("keyup", e => {
    if (e.key === "Enter" && e.target.value !== "") {
        const val = e.target.value;
        const item = {
          thing: val,
          checked: false,
          el: createChild(val)
        };

        item.el.addEventListener("click", event => {
          item.checked = event.target.checked;
          redoThings();
        });
        e.target.value = "";
        appendToSubject(things, item);
    }
  });
  qs(".clear-completed").addEventListener("click", e => {
    things.next([]);
  });
});