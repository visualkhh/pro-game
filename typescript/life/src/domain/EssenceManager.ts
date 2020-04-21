import {Item} from "./Item";
import {Essence} from "./Essence";
import {Type} from "../code/Type";

export class EssenceManager {
    public essences = new Map<String, Essence>();

    constructor() {
        console.log('-EssenceManager constu-')
        this.essences.set(Type.RIGHT_LEFT, new Essence(Type.RIGHT_LEFT, Type.RIGHT, Type.LEFT));
        this.essences.set(Type.UP_DOWN, new Essence(Type.UP_DOWN, Type.UP, Type.DOWN));
        this.essences.set(Type.DARK_BRIGHT, new Essence(Type.DARK_BRIGHT, Type.DARK, Type.BRIGHT));
        this.essences.set(Type.DISCONTINUOUS_SERIES, new Essence(Type.DISCONTINUOUS_SERIES, Type.DISCONTINUOUS, Type.SERIES));
        this.essences.set(Type.SLOW_FAST, new Essence(Type.SLOW_FAST, Type.SLOW, Type.FAST));
        this.essences.set(Type.SMALL_LARGE, new Essence(Type.SMALL_LARGE, Type.SMALL, Type.LARGE));
        this.essences.set(Type.SHORT_LONG, new Essence(Type.SHORT_LONG, Type.SHORT, Type.LONG));
        this.essences.set(Type.LESS_MORE, new Essence(Type.LESS_MORE, Type.LESS, Type.MORE));
        this.essences.set(Type.COLD_HOT, new Essence(Type.COLD_HOT, Type.COLD, Type.HOT));
        this.essences.set(Type.FLEXIBILITY_FIRMNESS, new Essence(Type.FLEXIBILITY_FIRMNESS, Type.FLEXIBILITY, Type.FIRMNESS));
        this.essences.set(Type.INSIDE_OUTSIDE, new Essence(Type.INSIDE_OUTSIDE, Type.INSIDE, Type.OUTSIDE));
        this.essences.set(Type.CLOSE_OPEN, new Essence(Type.CLOSE_OPEN, Type.CLOSE, Type.OPEN));
        this.essences.set(Type.SIMPLE_COMPLEXITY, new Essence(Type.SIMPLE_COMPLEXITY, Type.SIMPLE, Type.COMPLEXITY));
        this.essences.set(Type.LIGHT_HEAVY, new Essence(Type.LIGHT_HEAVY, Type.LIGHT, Type.HEAVY));
        this.essences.set(Type.NON_RECOGNITION_RECOGNITION, new Essence(Type.NON_RECOGNITION_RECOGNITION, Type.NON_RECOGNITION, Type.RECOGNITION));
        this.essences.set(Type.DISPERSED_LUMPED, new Essence(Type.DISPERSED_LUMPED, Type.DISPERSED, Type.LUMPED));
        this.essences.set(Type.POSITIVE_NAGATIVE, new Essence(Type.POSITIVE_NAGATIVE, Type.POSITIVE, Type.NAGATIVE));
        this.essences.set(Type.CHAOS_COSMOS, new Essence(Type.CHAOS_COSMOS, Type.CHAOS, Type.COSMOS));
        this.essences.set(Type.INELASTIC_ELASTICITY, new Essence(Type.INELASTIC_ELASTICITY, Type.INELASTIC, Type.ELASTICITY));
        this.essences.set(Type.IRREVERSIBLE_REVERSIBLE, new Essence(Type.IRREVERSIBLE_REVERSIBLE, Type.IRREVERSIBLE, Type.REVERSIBLE));
        this.essences.set(Type.PUSH_PULL, new Essence(Type.PUSH_PULL, Type.PUSH, Type.PULL));
        this.essences.set(Type.CONSERVATIVE_PROGRESSIVE, new Essence(Type.CONSERVATIVE_PROGRESSIVE, Type.CONSERVATIVE, Type.PROGRESSIVE));
        this.essences.set(Type.DEFENSIVE_ATTACKS, new Essence(Type.DEFENSIVE_ATTACKS, Type.DEFENSIVE, Type.ATTACKS));
        this.essences.set(Type.NARROW_WIDE, new Essence(Type.NARROW_WIDE, Type.NARROW, Type.WIDE));
    }
}
