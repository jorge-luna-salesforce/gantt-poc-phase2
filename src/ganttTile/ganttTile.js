import { api, LightningElement } from "lwc";
import { classSet } from "lightning/utils";

export default class Gantt extends LightningElement {
  @api tileData;
  @api interval;
  @api timeSlot;
  TILE_HEIGHT = 40;

  get tilesInSlot() {
    let tiles = this.tileData?.filter((tile) => tile.slotStart === this.timeSlot.id) ?? [];
    return tiles.map((t) => {
      return {
        id: t.id,
        slotStart: t.slotStart,
        slotEnd: t.slotEnd,
        style: `width:${this.calculateWidth(t.slotStart, t.slotEnd)}%;margin-top:${this.calculateTop(t.id)}px;margin-bottom:${this.calculateBottom(
          t.id
        )}px;`,
        label: `SA-${t.id}`
      };
    });
  }

  get tileClass() {
    const cssClassSet = classSet("slds-box slds-box_xx-small slds-theme_shade slds-theme_alert-texture");
    cssClassSet.add("slds-m-around_xx-small slds-text-align_center tile-base");
    return cssClassSet;
  }

  calculateWidth(start, end) {
    return (end - start + 1) * 100 - 5;
  }

  calculateTop(id) {
    let top = 10;
    const currentTile = this.tileData.find((x) => x.id === id).slotStart;
    let i = 0;
    for (i = 0; i < this.tileData.length; i++) {
      const tile = this.tileData[i];
      if (i > 0 && tile.slotStart <= this.tileData[i - 1].slotEnd) {
        top += this.TILE_HEIGHT;
      }
      if (tile.id === id) {
        break;
      }
    }

    for (let j = i; j > 0; j--) {
      if (this.tileData[j].slotStart === this.tileData[j - 1].slotStart) {
        top -= this.TILE_HEIGHT;
      } else {
        break;
      }
    }

    return top;
  }

  calculateBottom(id) {
    if (this.tileData.findIndex((x) => x.id === id) + 1 === this.tileData.length) {
      return 10;
    }
    return 2;
  }
}
