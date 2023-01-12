import { IPlaybackListener } from "../Common/Interfaces/IPlaybackListener";
export declare class MyListener implements IPlaybackListener {
    selectionEndReached(o: object): void;
    cursorPositionChanged(o: object): void;
    pauseOccurred(o: object): void;
    resetOccurred(o: object): void;
    notesPlaybackEventOccurred(o: object): void;
}
