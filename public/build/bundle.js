
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function classMap(classObj) {
        return Object.entries(classObj)
            .filter(([name, value]) => name !== '' && value)
            .map(([name]) => name)
            .join(' ');
    }

    function dispatch(element, eventType, detail, eventInit = { bubbles: true }, 
    /** This is an internal thing used by SMUI to duplicate some SMUI events as MDC events. */
    duplicateEventForMDC = false) {
        if (typeof Event !== 'undefined' && element) {
            const event = new CustomEvent(eventType, Object.assign(Object.assign({}, eventInit), { detail }));
            element === null || element === void 0 ? void 0 : element.dispatchEvent(event);
            if (duplicateEventForMDC && eventType.startsWith('SMUI')) {
                const duplicateEvent = new CustomEvent(eventType.replace(/^SMUI/g, () => 'MDC'), Object.assign(Object.assign({}, eventInit), { detail }));
                element === null || element === void 0 ? void 0 : element.dispatchEvent(duplicateEvent);
                if (duplicateEvent.defaultPrevented) {
                    event.preventDefault();
                }
            }
            return event;
        }
    }

    function exclude(obj, keys) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const cashIndex = name.indexOf('$');
            if (cashIndex !== -1 &&
                keys.indexOf(name.substring(0, cashIndex + 1)) !== -1) {
                continue;
            }
            if (keys.indexOf(name) !== -1) {
                continue;
            }
            newObj[name] = obj[name];
        }
        return newObj;
    }

    // Match old modifiers. (only works on DOM events)
    const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    // Match new modifiers.
    const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    function forwardEventsBuilder(component) {
        // This is our pseudo $on function. It is defined on component mount.
        let $on;
        // This is a list of events bound before mount.
        let events = [];
        // And we override the $on function to forward all bound events.
        component.$on = (fullEventType, callback) => {
            let eventType = fullEventType;
            let destructor = () => { };
            if ($on) {
                // The event was bound programmatically.
                destructor = $on(eventType, callback);
            }
            else {
                // The event was bound before mount by Svelte.
                events.push([eventType, callback]);
            }
            const oldModifierMatch = eventType.match(oldModifierRegex);
            if (oldModifierMatch && console) {
                console.warn('Event modifiers in SMUI now use "$" instead of ":", so that ' +
                    'all events can be bound with modifiers. Please update your ' +
                    'event binding: ', eventType);
            }
            return () => {
                destructor();
            };
        };
        function forward(e) {
            // Internally bubble the event up from Svelte components.
            bubble(component, e);
        }
        return (node) => {
            const destructors = [];
            const forwardDestructors = {};
            // This function is responsible for listening and forwarding
            // all bound events.
            $on = (fullEventType, callback) => {
                let eventType = fullEventType;
                let handler = callback;
                // DOM addEventListener options argument.
                let options = false;
                const oldModifierMatch = eventType.match(oldModifierRegex);
                const newModifierMatch = eventType.match(newModifierRegex);
                const modifierMatch = oldModifierMatch || newModifierMatch;
                if (eventType.match(/^SMUI:\w+:/)) {
                    const newEventTypeParts = eventType.split(':');
                    let newEventType = '';
                    for (let i = 0; i < newEventTypeParts.length; i++) {
                        newEventType +=
                            i === newEventTypeParts.length - 1
                                ? ':' + newEventTypeParts[i]
                                : newEventTypeParts[i]
                                    .split('-')
                                    .map((value) => value.slice(0, 1).toUpperCase() + value.slice(1))
                                    .join('');
                    }
                    console.warn(`The event ${eventType.split('$')[0]} has been renamed to ${newEventType.split('$')[0]}.`);
                    eventType = newEventType;
                }
                if (modifierMatch) {
                    // Parse the event modifiers.
                    // Supported modifiers:
                    // - preventDefault
                    // - stopPropagation
                    // - passive
                    // - nonpassive
                    // - capture
                    // - once
                    const parts = eventType.split(oldModifierMatch ? ':' : '$');
                    eventType = parts[0];
                    const eventOptions = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
                    if (eventOptions.passive) {
                        options = options || {};
                        options.passive = true;
                    }
                    if (eventOptions.nonpassive) {
                        options = options || {};
                        options.passive = false;
                    }
                    if (eventOptions.capture) {
                        options = options || {};
                        options.capture = true;
                    }
                    if (eventOptions.once) {
                        options = options || {};
                        options.once = true;
                    }
                    if (eventOptions.preventDefault) {
                        handler = prevent_default(handler);
                    }
                    if (eventOptions.stopPropagation) {
                        handler = stop_propagation(handler);
                    }
                }
                // Listen for the event directly, with the given options.
                const off = listen(node, eventType, handler, options);
                const destructor = () => {
                    off();
                    const idx = destructors.indexOf(destructor);
                    if (idx > -1) {
                        destructors.splice(idx, 1);
                    }
                };
                destructors.push(destructor);
                // Forward the event from Svelte.
                if (!(eventType in forwardDestructors)) {
                    forwardDestructors[eventType] = listen(node, eventType, forward);
                }
                return destructor;
            };
            for (let i = 0; i < events.length; i++) {
                // Listen to all the events added before mount.
                $on(events[i][0], events[i][1]);
            }
            return {
                destroy: () => {
                    // Remove all event listeners.
                    for (let i = 0; i < destructors.length; i++) {
                        destructors[i]();
                    }
                    // Remove all event forwarders.
                    for (let entry of Object.entries(forwardDestructors)) {
                        entry[1]();
                    }
                },
            };
        };
    }

    function prefixFilter(obj, prefix) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            if (name.substring(0, prefix.length) === prefix) {
                newObj[name.substring(prefix.length)] = obj[name];
            }
        }
        return newObj;
    }

    function useActions(node, actions) {
        let actionReturns = [];
        if (actions) {
            for (let i = 0; i < actions.length; i++) {
                const actionEntry = actions[i];
                const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
                if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                    actionReturns.push(action(node, actionEntry[1]));
                }
                else {
                    actionReturns.push(action(node));
                }
            }
        }
        return {
            update(actions) {
                if (((actions && actions.length) || 0) != actionReturns.length) {
                    throw new Error('You must not change the length of an actions array.');
                }
                if (actions) {
                    for (let i = 0; i < actions.length; i++) {
                        const returnEntry = actionReturns[i];
                        if (returnEntry && returnEntry.update) {
                            const actionEntry = actions[i];
                            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                                returnEntry.update(actionEntry[1]);
                            }
                            else {
                                returnEntry.update();
                            }
                        }
                    }
                }
            },
            destroy() {
                for (let i = 0; i < actionReturns.length; i++) {
                    const returnEntry = actionReturns[i];
                    if (returnEntry && returnEntry.destroy) {
                        returnEntry.destroy();
                    }
                }
            },
        };
    }

    /**
     * Stores result from supportsCssVariables to avoid redundant processing to
     * detect CSS custom variable support.
     */
    var supportsCssVariables_;
    function supportsCssVariables(windowObj, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        var CSS = windowObj.CSS;
        var supportsCssVars = supportsCssVariables_;
        if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
            return supportsCssVariables_;
        }
        var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
        if (!supportsFunctionPresent) {
            return false;
        }
        var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
        // See: https://bugs.webkit.org/show_bug.cgi?id=154669
        // See: README section on Safari
        var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
            CSS.supports('color', '#00000000'));
        supportsCssVars =
            explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
        if (!forceRefresh) {
            supportsCssVariables_ = supportsCssVars;
        }
        return supportsCssVars;
    }
    function getNormalizedEventCoords(evt, pageOffset, clientRect) {
        if (!evt) {
            return { x: 0, y: 0 };
        }
        var x = pageOffset.x, y = pageOffset.y;
        var documentX = x + clientRect.left;
        var documentY = y + clientRect.top;
        var normalizedX;
        var normalizedY;
        // Determine touch point relative to the ripple container.
        if (evt.type === 'touchstart') {
            var touchEvent = evt;
            normalizedX = touchEvent.changedTouches[0].pageX - documentX;
            normalizedY = touchEvent.changedTouches[0].pageY - documentY;
        }
        else {
            var mouseEvent = evt;
            normalizedX = mouseEvent.pageX - documentX;
            normalizedY = mouseEvent.pageY - documentY;
        }
        return { x: normalizedX, y: normalizedY };
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFoundation = /** @class */ (function () {
        function MDCFoundation(adapter) {
            if (adapter === void 0) { adapter = {}; }
            this.adapter = adapter;
        }
        Object.defineProperty(MDCFoundation, "cssClasses", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports every
                // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "strings", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "numbers", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "defaultAdapter", {
            get: function () {
                // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
                // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
                // validation.
                return {};
            },
            enumerable: false,
            configurable: true
        });
        MDCFoundation.prototype.init = function () {
            // Subclasses should override this method to perform initialization routines (registering events, etc.)
        };
        MDCFoundation.prototype.destroy = function () {
            // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
        };
        return MDCFoundation;
    }());

    /**
     * @license
     * Copyright 2019 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Determine whether the current browser supports passive event listeners, and
     * if so, use them.
     */
    function applyPassive$1(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        return supportsPassiveOption(globalObj) ?
            { passive: true } :
            false;
    }
    function supportsPassiveOption(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        // See
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        var passiveSupported = false;
        try {
            var options = {
                // This function will be called when the browser
                // attempts to access the passive property.
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            var handler = function () { };
            globalObj.document.addEventListener('test', handler, options);
            globalObj.document.removeEventListener('test', handler, options);
        }
        catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        applyPassive: applyPassive$1
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
     * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
     */
    function closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        var el = element;
        while (el) {
            if (matches$1(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }
    function matches$1(element, selector) {
        var nativeMatches = element.matches
            || element.webkitMatchesSelector
            || element.msMatchesSelector;
        return nativeMatches.call(element, selector);
    }
    /**
     * Used to compute the estimated scroll width of elements. When an element is
     * hidden due to display: none; being applied to a parent element, the width is
     * returned as 0. However, the element will have a true width once no longer
     * inside a display: none context. This method computes an estimated width when
     * the element is hidden or returns the true width when the element is visble.
     * @param {Element} element the element whose width to estimate
     */
    function estimateScrollWidth(element) {
        // Check the offsetParent. If the element inherits display: none from any
        // parent, the offsetParent property will be null (see
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
        // This check ensures we only clone the node when necessary.
        var htmlEl = element;
        if (htmlEl.offsetParent !== null) {
            return htmlEl.scrollWidth;
        }
        var clone = htmlEl.cloneNode(true);
        clone.style.setProperty('position', 'absolute');
        clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
        document.documentElement.appendChild(clone);
        var scrollWidth = clone.scrollWidth;
        document.documentElement.removeChild(clone);
        return scrollWidth;
    }

    var ponyfill = /*#__PURE__*/Object.freeze({
        __proto__: null,
        closest: closest,
        matches: matches$1,
        estimateScrollWidth: estimateScrollWidth
    });

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$2 = {
        // Ripple is a special case where the "root" component is really a "mixin" of sorts,
        // given that it's an 'upgrade' to an existing component. That being said it is the root
        // CSS class that all other CSS classes derive from.
        BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
        FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
        FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
        ROOT: 'mdc-ripple-upgraded',
        UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
    };
    var strings$2 = {
        VAR_FG_SCALE: '--mdc-ripple-fg-scale',
        VAR_FG_SIZE: '--mdc-ripple-fg-size',
        VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
        VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
        VAR_LEFT: '--mdc-ripple-left',
        VAR_TOP: '--mdc-ripple-top',
    };
    var numbers$1 = {
        DEACTIVATION_TIMEOUT_MS: 225,
        FG_DEACTIVATION_MS: 150,
        INITIAL_ORIGIN_SCALE: 0.6,
        PADDING: 10,
        TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
    };

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    // Activation events registered on the root element of each instance for activation
    var ACTIVATION_EVENT_TYPES = [
        'touchstart', 'pointerdown', 'mousedown', 'keydown',
    ];
    // Deactivation events registered on documentElement when a pointer-related down event occurs
    var POINTER_DEACTIVATION_EVENT_TYPES = [
        'touchend', 'pointerup', 'mouseup', 'contextmenu',
    ];
    // simultaneous nested activations
    var activatedTargets = [];
    var MDCRippleFoundation = /** @class */ (function (_super) {
        __extends(MDCRippleFoundation, _super);
        function MDCRippleFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
            _this.activationAnimationHasEnded = false;
            _this.activationTimer = 0;
            _this.fgDeactivationRemovalTimer = 0;
            _this.fgScale = '0';
            _this.frame = { width: 0, height: 0 };
            _this.initialSize = 0;
            _this.layoutFrame = 0;
            _this.maxRadius = 0;
            _this.unboundedCoords = { left: 0, top: 0 };
            _this.activationState = _this.defaultActivationState();
            _this.activationTimerCallback = function () {
                _this.activationAnimationHasEnded = true;
                _this.runDeactivationUXLogicIfReady();
            };
            _this.activateHandler = function (e) {
                _this.activateImpl(e);
            };
            _this.deactivateHandler = function () {
                _this.deactivateImpl();
            };
            _this.focusHandler = function () {
                _this.handleFocus();
            };
            _this.blurHandler = function () {
                _this.handleBlur();
            };
            _this.resizeHandler = function () {
                _this.layout();
            };
            return _this;
        }
        Object.defineProperty(MDCRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "strings", {
            get: function () {
                return strings$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "numbers", {
            get: function () {
                return numbers$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    browserSupportsCssVars: function () { return true; },
                    computeBoundingRect: function () {
                        return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                    },
                    containsEventTarget: function () { return true; },
                    deregisterDocumentInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    deregisterResizeHandler: function () { return undefined; },
                    getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                    isSurfaceActive: function () { return true; },
                    isSurfaceDisabled: function () { return true; },
                    isUnbounded: function () { return true; },
                    registerDocumentInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                    registerResizeHandler: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    updateCssVariable: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCRippleFoundation.prototype.init = function () {
            var _this = this;
            var supportsPressRipple = this.supportsPressRipple();
            this.registerRootHandlers(supportsPressRipple);
            if (supportsPressRipple) {
                var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.addClass(ROOT_1);
                    if (_this.adapter.isUnbounded()) {
                        _this.adapter.addClass(UNBOUNDED_1);
                        // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                        _this.layoutInternal();
                    }
                });
            }
        };
        MDCRippleFoundation.prototype.destroy = function () {
            var _this = this;
            if (this.supportsPressRipple()) {
                if (this.activationTimer) {
                    clearTimeout(this.activationTimer);
                    this.activationTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
                }
                if (this.fgDeactivationRemovalTimer) {
                    clearTimeout(this.fgDeactivationRemovalTimer);
                    this.fgDeactivationRemovalTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
                }
                var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.removeClass(ROOT_2);
                    _this.adapter.removeClass(UNBOUNDED_2);
                    _this.removeCssVars();
                });
            }
            this.deregisterRootHandlers();
            this.deregisterDeactivationHandlers();
        };
        /**
         * @param evt Optional event containing position information.
         */
        MDCRippleFoundation.prototype.activate = function (evt) {
            this.activateImpl(evt);
        };
        MDCRippleFoundation.prototype.deactivate = function () {
            this.deactivateImpl();
        };
        MDCRippleFoundation.prototype.layout = function () {
            var _this = this;
            if (this.layoutFrame) {
                cancelAnimationFrame(this.layoutFrame);
            }
            this.layoutFrame = requestAnimationFrame(function () {
                _this.layoutInternal();
                _this.layoutFrame = 0;
            });
        };
        MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
            var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
            if (unbounded) {
                this.adapter.addClass(UNBOUNDED);
            }
            else {
                this.adapter.removeClass(UNBOUNDED);
            }
        };
        MDCRippleFoundation.prototype.handleFocus = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        MDCRippleFoundation.prototype.handleBlur = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        /**
         * We compute this property so that we are not querying information about the client
         * until the point in time where the foundation requests it. This prevents scenarios where
         * client-side feature-detection may happen too early, such as when components are rendered on the server
         * and then initialized at mount time on the client.
         */
        MDCRippleFoundation.prototype.supportsPressRipple = function () {
            return this.adapter.browserSupportsCssVars();
        };
        MDCRippleFoundation.prototype.defaultActivationState = function () {
            return {
                activationEvent: undefined,
                hasDeactivationUXRun: false,
                isActivated: false,
                isProgrammatic: false,
                wasActivatedByPointer: false,
                wasElementMadeActive: false,
            };
        };
        /**
         * supportsPressRipple Passed from init to save a redundant function call
         */
        MDCRippleFoundation.prototype.registerRootHandlers = function (supportsPressRipple) {
            var e_1, _a;
            if (supportsPressRipple) {
                try {
                    for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerInteractionHandler(evtType, this.activateHandler);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return)) _a.call(ACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (this.adapter.isUnbounded()) {
                    this.adapter.registerResizeHandler(this.resizeHandler);
                }
            }
            this.adapter.registerInteractionHandler('focus', this.focusHandler);
            this.adapter.registerInteractionHandler('blur', this.blurHandler);
        };
        MDCRippleFoundation.prototype.registerDeactivationHandlers = function (evt) {
            var e_2, _a;
            if (evt.type === 'keydown') {
                this.adapter.registerInteractionHandler('keyup', this.deactivateHandler);
            }
            else {
                try {
                    for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        MDCRippleFoundation.prototype.deregisterRootHandlers = function () {
            var e_3, _a;
            try {
                for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return)) _a.call(ACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this.adapter.deregisterInteractionHandler('focus', this.focusHandler);
            this.adapter.deregisterInteractionHandler('blur', this.blurHandler);
            if (this.adapter.isUnbounded()) {
                this.adapter.deregisterResizeHandler(this.resizeHandler);
            }
        };
        MDCRippleFoundation.prototype.deregisterDeactivationHandlers = function () {
            var e_4, _a;
            this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler);
            try {
                for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        MDCRippleFoundation.prototype.removeCssVars = function () {
            var _this = this;
            var rippleStrings = MDCRippleFoundation.strings;
            var keys = Object.keys(rippleStrings);
            keys.forEach(function (key) {
                if (key.indexOf('VAR_') === 0) {
                    _this.adapter.updateCssVariable(rippleStrings[key], null);
                }
            });
        };
        MDCRippleFoundation.prototype.activateImpl = function (evt) {
            var _this = this;
            if (this.adapter.isSurfaceDisabled()) {
                return;
            }
            var activationState = this.activationState;
            if (activationState.isActivated) {
                return;
            }
            // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
            var previousActivationEvent = this.previousActivationEvent;
            var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
            if (isSameInteraction) {
                return;
            }
            activationState.isActivated = true;
            activationState.isProgrammatic = evt === undefined;
            activationState.activationEvent = evt;
            activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
            var hasActivatedChild = evt !== undefined &&
                activatedTargets.length > 0 &&
                activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
            if (hasActivatedChild) {
                // Immediately reset activation state, while preserving logic that prevents touch follow-on events
                this.resetActivationState();
                return;
            }
            if (evt !== undefined) {
                activatedTargets.push(evt.target);
                this.registerDeactivationHandlers(evt);
            }
            activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
            if (activationState.wasElementMadeActive) {
                this.animateActivation();
            }
            requestAnimationFrame(function () {
                // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
                activatedTargets = [];
                if (!activationState.wasElementMadeActive
                    && evt !== undefined
                    && (evt.key === ' ' || evt.keyCode === 32)) {
                    // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                    // active states inconsistently when they're called within event handling code:
                    // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                    // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                    // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                    // variable is set within a rAF callback for a submit button interaction (#2241).
                    activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
                    if (activationState.wasElementMadeActive) {
                        _this.animateActivation();
                    }
                }
                if (!activationState.wasElementMadeActive) {
                    // Reset activation state immediately if element was not made active.
                    _this.activationState = _this.defaultActivationState();
                }
            });
        };
        MDCRippleFoundation.prototype.checkElementMadeActive = function (evt) {
            return (evt !== undefined && evt.type === 'keydown') ?
                this.adapter.isSurfaceActive() :
                true;
        };
        MDCRippleFoundation.prototype.animateActivation = function () {
            var _this = this;
            var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
            var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
            var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
            this.layoutInternal();
            var translateStart = '';
            var translateEnd = '';
            if (!this.adapter.isUnbounded()) {
                var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
                translateStart = startPoint.x + "px, " + startPoint.y + "px";
                translateEnd = endPoint.x + "px, " + endPoint.y + "px";
            }
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
            // Cancel any ongoing activation/deactivation animations
            clearTimeout(this.activationTimer);
            clearTimeout(this.fgDeactivationRemovalTimer);
            this.rmBoundedActivationClasses();
            this.adapter.removeClass(FG_DEACTIVATION);
            // Force layout in order to re-trigger the animation.
            this.adapter.computeBoundingRect();
            this.adapter.addClass(FG_ACTIVATION);
            this.activationTimer = setTimeout(function () {
                _this.activationTimerCallback();
            }, DEACTIVATION_TIMEOUT_MS);
        };
        MDCRippleFoundation.prototype.getFgTranslationCoordinates = function () {
            var _a = this.activationState, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
            var startPoint;
            if (wasActivatedByPointer) {
                startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
            }
            else {
                startPoint = {
                    x: this.frame.width / 2,
                    y: this.frame.height / 2,
                };
            }
            // Center the element around the start point.
            startPoint = {
                x: startPoint.x - (this.initialSize / 2),
                y: startPoint.y - (this.initialSize / 2),
            };
            var endPoint = {
                x: (this.frame.width / 2) - (this.initialSize / 2),
                y: (this.frame.height / 2) - (this.initialSize / 2),
            };
            return { startPoint: startPoint, endPoint: endPoint };
        };
        MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady = function () {
            var _this = this;
            // This method is called both when a pointing device is released, and when the activation animation ends.
            // The deactivation animation should only run after both of those occur.
            var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
            var _a = this.activationState, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
            var activationHasEnded = hasDeactivationUXRun || !isActivated;
            if (activationHasEnded && this.activationAnimationHasEnded) {
                this.rmBoundedActivationClasses();
                this.adapter.addClass(FG_DEACTIVATION);
                this.fgDeactivationRemovalTimer = setTimeout(function () {
                    _this.adapter.removeClass(FG_DEACTIVATION);
                }, numbers$1.FG_DEACTIVATION_MS);
            }
        };
        MDCRippleFoundation.prototype.rmBoundedActivationClasses = function () {
            var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
            this.adapter.removeClass(FG_ACTIVATION);
            this.activationAnimationHasEnded = false;
            this.adapter.computeBoundingRect();
        };
        MDCRippleFoundation.prototype.resetActivationState = function () {
            var _this = this;
            this.previousActivationEvent = this.activationState.activationEvent;
            this.activationState = this.defaultActivationState();
            // Touch devices may fire additional events for the same interaction within a short time.
            // Store the previous event until it's safe to assume that subsequent events are for new interactions.
            setTimeout(function () { return _this.previousActivationEvent = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
        };
        MDCRippleFoundation.prototype.deactivateImpl = function () {
            var _this = this;
            var activationState = this.activationState;
            // This can happen in scenarios such as when you have a keyup event that blurs the element.
            if (!activationState.isActivated) {
                return;
            }
            var state = __assign({}, activationState);
            if (activationState.isProgrammatic) {
                requestAnimationFrame(function () {
                    _this.animateDeactivation(state);
                });
                this.resetActivationState();
            }
            else {
                this.deregisterDeactivationHandlers();
                requestAnimationFrame(function () {
                    _this.activationState.hasDeactivationUXRun = true;
                    _this.animateDeactivation(state);
                    _this.resetActivationState();
                });
            }
        };
        MDCRippleFoundation.prototype.animateDeactivation = function (_a) {
            var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
            if (wasActivatedByPointer || wasElementMadeActive) {
                this.runDeactivationUXLogicIfReady();
            }
        };
        MDCRippleFoundation.prototype.layoutInternal = function () {
            var _this = this;
            this.frame = this.adapter.computeBoundingRect();
            var maxDim = Math.max(this.frame.height, this.frame.width);
            // Surface diameter is treated differently for unbounded vs. bounded ripples.
            // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
            // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
            // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
            // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
            // `overflow: hidden`.
            var getBoundedRadius = function () {
                var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
                return hypotenuse + MDCRippleFoundation.numbers.PADDING;
            };
            this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
            // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
            var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
            // Unbounded ripple size should always be even number to equally center align.
            if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
                this.initialSize = initialSize - 1;
            }
            else {
                this.initialSize = initialSize;
            }
            this.fgScale = "" + this.maxRadius / this.initialSize;
            this.updateLayoutCssVars();
        };
        MDCRippleFoundation.prototype.updateLayoutCssVars = function () {
            var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
            this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
            this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
            if (this.adapter.isUnbounded()) {
                this.unboundedCoords = {
                    left: Math.round((this.frame.width / 2) - (this.initialSize / 2)),
                    top: Math.round((this.frame.height / 2) - (this.initialSize / 2)),
                };
                this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
                this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
            }
        };
        return MDCRippleFoundation;
    }(MDCFoundation));

    const { applyPassive } = events;
    const { matches } = ponyfill;
    function Ripple(node, { ripple = true, surface = false, unbounded = false, disabled = false, color, active, rippleElement, eventTarget, activeTarget, addClass = (className) => node.classList.add(className), removeClass = (className) => node.classList.remove(className), addStyle = (name, value) => node.style.setProperty(name, value), initPromise = Promise.resolve(), } = {}) {
        let instance;
        let addLayoutListener = getContext('SMUI:addLayoutListener');
        let removeLayoutListener;
        let oldActive = active;
        let oldEventTarget = eventTarget;
        let oldActiveTarget = activeTarget;
        function handleProps() {
            if (surface) {
                addClass('mdc-ripple-surface');
                if (color === 'primary') {
                    addClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                else if (color === 'secondary') {
                    removeClass('smui-ripple-surface--primary');
                    addClass('smui-ripple-surface--secondary');
                }
                else {
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
            }
            else {
                removeClass('mdc-ripple-surface');
                removeClass('smui-ripple-surface--primary');
                removeClass('smui-ripple-surface--secondary');
            }
            // Handle activation first.
            if (instance && oldActive !== active) {
                oldActive = active;
                if (active) {
                    instance.activate();
                }
                else if (active === false) {
                    instance.deactivate();
                }
            }
            // Then create/destroy an instance.
            if (ripple && !instance) {
                instance = new MDCRippleFoundation({
                    addClass,
                    browserSupportsCssVars: () => supportsCssVariables(window),
                    computeBoundingRect: () => (rippleElement || node).getBoundingClientRect(),
                    containsEventTarget: (target) => node.contains(target),
                    deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
                    deregisterInteractionHandler: (evtType, handler) => (eventTarget || node).removeEventListener(evtType, handler, applyPassive()),
                    deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
                    getWindowPageOffset: () => ({
                        x: window.pageXOffset,
                        y: window.pageYOffset,
                    }),
                    isSurfaceActive: () => active == null ? matches(activeTarget || node, ':active') : active,
                    isSurfaceDisabled: () => !!disabled,
                    isUnbounded: () => !!unbounded,
                    registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
                    registerInteractionHandler: (evtType, handler) => (eventTarget || node).addEventListener(evtType, handler, applyPassive()),
                    registerResizeHandler: (handler) => window.addEventListener('resize', handler),
                    removeClass,
                    updateCssVariable: addStyle,
                });
                initPromise.then(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            else if (instance && !ripple) {
                initPromise.then(() => {
                    if (instance) {
                        instance.destroy();
                        instance = undefined;
                    }
                });
            }
            // Now handle event/active targets
            if (instance &&
                (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)) {
                oldEventTarget = eventTarget;
                oldActiveTarget = activeTarget;
                instance.destroy();
                requestAnimationFrame(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            if (!ripple && unbounded) {
                addClass('mdc-ripple-upgraded--unbounded');
            }
        }
        handleProps();
        if (addLayoutListener) {
            removeLayoutListener = addLayoutListener(layout);
        }
        function layout() {
            if (instance) {
                instance.layout();
            }
        }
        return {
            update(props) {
                ({
                    ripple,
                    surface,
                    unbounded,
                    disabled,
                    color,
                    active,
                    rippleElement,
                    eventTarget,
                    activeTarget,
                    addClass,
                    removeClass,
                    addStyle,
                    initPromise,
                } = Object.assign({ ripple: true, surface: false, unbounded: false, disabled: false, color: undefined, active: undefined, rippleElement: undefined, eventTarget: undefined, activeTarget: undefined, addClass: (className) => node.classList.add(className), removeClass: (className) => node.classList.remove(className), addStyle: (name, value) => node.style.setProperty(name, value), initPromise: Promise.resolve() }, props));
                handleProps();
            },
            destroy() {
                if (instance) {
                    instance.destroy();
                    instance = undefined;
                    removeClass('mdc-ripple-surface');
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                if (removeLayoutListener) {
                    removeLayoutListener();
                }
            },
        };
    }

    /* node_modules\@smui\common\dist\elements\A.svelte generated by Svelte v3.44.3 */
    const file$g = "node_modules\\@smui\\common\\dist\\elements\\A.svelte";

    function create_fragment$h(ctx) {
    	let a;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let a_levels = [{ href: /*href*/ ctx[1] }, /*$$restProps*/ ctx[4]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$g, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			/*a_binding*/ ctx[8](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, a, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[3].call(null, a))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 2) && { href: /*href*/ ctx[1] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			/*a_binding*/ ctx[8](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","href","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('A', slots, ['default']);
    	let { use = [] } = $$props;
    	let { href = 'javascript:void(0);' } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('href' in $$new_props) $$invalidate(1, href = $$new_props.href);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		href,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('href' in $$props) $$invalidate(1, href = $$new_props.href);
    		if ('element' in $$props) $$invalidate(2, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		href,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		a_binding
    	];
    }

    class A$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$h, safe_not_equal, { use: 0, href: 1, getElement: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "A",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get use() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[5];
    	}

    	set getElement(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\elements\Button.svelte generated by Svelte v3.44.3 */
    const file$f = "node_modules\\@smui\\common\\dist\\elements\\Button.svelte";

    function create_fragment$g(ctx) {
    	let button;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let button_levels = [/*$$restProps*/ ctx[3]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[7](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, button, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, button))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			/*button_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		button_binding
    	];
    }

    class Button$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$g, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get use() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\elements\Span.svelte generated by Svelte v3.44.3 */
    const file$e = "node_modules\\@smui\\common\\dist\\elements\\Span.svelte";

    function create_fragment$f(ctx) {
    	let span;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let span_levels = [/*$$restProps*/ ctx[3]];
    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			set_attributes(span, span_data);
    			add_location(span, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[7](span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, span, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, span))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			/*span_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Span', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		span_binding
    	];
    }

    class Span extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$f, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Span",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get use() {
    		throw new Error("<Span>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Span>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Span>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const A = A$1;
    const Button = Button$1;

    /* node_modules\@smui\button\dist\Button.svelte generated by Svelte v3.44.3 */
    const file$d = "node_modules\\@smui\\button\\dist\\Button.svelte";

    // (50:10) {#if touch}
    function create_if_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "mdc-button__touch");
    			add_location(div, file$d, 49, 21, 1522);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(50:10) {#if touch}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: false,         color,         disabled: !!$$restProps.disabled,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-button': true,     'mdc-button--raised': variant === 'raised',     'mdc-button--unelevated': variant === 'unelevated',     'mdc-button--outlined': variant === 'outlined',     'smui-button--color-secondary': color === 'secondary',     'mdc-button--touch': touch,     'mdc-card__action': context === 'card:action',     'mdc-card__action--button': context === 'card:action',     'mdc-dialog__button': context === 'dialog:action',     'mdc-top-app-bar__navigation-icon': context === 'top-app-bar:navigation',     'mdc-top-app-bar__action-item': context === 'top-app-bar:action',     'mdc-snackbar__action': context === 'snackbar:actions',     'mdc-banner__secondary-action': context === 'banner' && secondary,     'mdc-banner__primary-action': context === 'banner' && !secondary,     'mdc-tooltip__action': context === 'tooltip:rich-actions',     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   {...actionProp}   {...defaultProp}   {...secondaryProp}   {href}   on:click={handleClick}   {...$$restProps}   >
    function create_default_slot$7(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[27].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[29], null);
    	let if_block = /*touch*/ ctx[6] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (default_slot) default_slot.c();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "mdc-button__ripple");
    			add_location(div, file$d, 48, 3, 1466);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 536870912)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[29],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[29])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[29], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*touch*/ ctx[6]) {
    				if (if_block) ; else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: false,         color,         disabled: !!$$restProps.disabled,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-button': true,     'mdc-button--raised': variant === 'raised',     'mdc-button--unelevated': variant === 'unelevated',     'mdc-button--outlined': variant === 'outlined',     'smui-button--color-secondary': color === 'secondary',     'mdc-button--touch': touch,     'mdc-card__action': context === 'card:action',     'mdc-card__action--button': context === 'card:action',     'mdc-dialog__button': context === 'dialog:action',     'mdc-top-app-bar__navigation-icon': context === 'top-app-bar:navigation',     'mdc-top-app-bar__action-item': context === 'top-app-bar:action',     'mdc-snackbar__action': context === 'snackbar:actions',     'mdc-banner__secondary-action': context === 'banner' && secondary,     'mdc-banner__primary-action': context === 'banner' && !secondary,     'mdc-tooltip__action': context === 'tooltip:rich-actions',     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   {...actionProp}   {...defaultProp}   {...secondaryProp}   {href}   on:click={handleClick}   {...$$restProps}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [
    				[
    					Ripple,
    					{
    						ripple: /*ripple*/ ctx[3],
    						unbounded: false,
    						color: /*color*/ ctx[4],
    						disabled: !!/*$$restProps*/ ctx[22].disabled,
    						addClass: /*addClass*/ ctx[18],
    						removeClass: /*removeClass*/ ctx[19],
    						addStyle: /*addStyle*/ ctx[20]
    					}
    				],
    				/*forwardEvents*/ ctx[16],
    				.../*use*/ ctx[0]
    			]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-button': true,
    				'mdc-button--raised': /*variant*/ ctx[5] === 'raised',
    				'mdc-button--unelevated': /*variant*/ ctx[5] === 'unelevated',
    				'mdc-button--outlined': /*variant*/ ctx[5] === 'outlined',
    				'smui-button--color-secondary': /*color*/ ctx[4] === 'secondary',
    				'mdc-button--touch': /*touch*/ ctx[6],
    				'mdc-card__action': /*context*/ ctx[17] === 'card:action',
    				'mdc-card__action--button': /*context*/ ctx[17] === 'card:action',
    				'mdc-dialog__button': /*context*/ ctx[17] === 'dialog:action',
    				'mdc-top-app-bar__navigation-icon': /*context*/ ctx[17] === 'top-app-bar:navigation',
    				'mdc-top-app-bar__action-item': /*context*/ ctx[17] === 'top-app-bar:action',
    				'mdc-snackbar__action': /*context*/ ctx[17] === 'snackbar:actions',
    				'mdc-banner__secondary-action': /*context*/ ctx[17] === 'banner' && /*secondary*/ ctx[8],
    				'mdc-banner__primary-action': /*context*/ ctx[17] === 'banner' && !/*secondary*/ ctx[8],
    				'mdc-tooltip__action': /*context*/ ctx[17] === 'tooltip:rich-actions',
    				.../*internalClasses*/ ctx[11]
    			})
    		},
    		{
    			style: Object.entries(/*internalStyles*/ ctx[12]).map(func$2).concat([/*style*/ ctx[2]]).join(' ')
    		},
    		/*actionProp*/ ctx[15],
    		/*defaultProp*/ ctx[14],
    		/*secondaryProp*/ ctx[13],
    		{ href: /*href*/ ctx[7] },
    		/*$$restProps*/ ctx[22]
    	];

    	var switch_value = /*component*/ ctx[9];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$7] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[28](switch_instance);
    		switch_instance.$on("click", /*handleClick*/ ctx[21]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*Ripple, ripple, color, $$restProps, addClass, removeClass, addStyle, forwardEvents, use, classMap, className, variant, touch, context, secondary, internalClasses, Object, internalStyles, style, actionProp, defaultProp, secondaryProp, href*/ 6289919)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*Ripple, ripple, color, $$restProps, addClass, removeClass, addStyle, forwardEvents, use*/ 6094873 && {
    						use: [
    							[
    								Ripple,
    								{
    									ripple: /*ripple*/ ctx[3],
    									unbounded: false,
    									color: /*color*/ ctx[4],
    									disabled: !!/*$$restProps*/ ctx[22].disabled,
    									addClass: /*addClass*/ ctx[18],
    									removeClass: /*removeClass*/ ctx[19],
    									addStyle: /*addStyle*/ ctx[20]
    								}
    							],
    							/*forwardEvents*/ ctx[16],
    							.../*use*/ ctx[0]
    						]
    					},
    					dirty & /*classMap, className, variant, color, touch, context, secondary, internalClasses*/ 133490 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							'mdc-button': true,
    							'mdc-button--raised': /*variant*/ ctx[5] === 'raised',
    							'mdc-button--unelevated': /*variant*/ ctx[5] === 'unelevated',
    							'mdc-button--outlined': /*variant*/ ctx[5] === 'outlined',
    							'smui-button--color-secondary': /*color*/ ctx[4] === 'secondary',
    							'mdc-button--touch': /*touch*/ ctx[6],
    							'mdc-card__action': /*context*/ ctx[17] === 'card:action',
    							'mdc-card__action--button': /*context*/ ctx[17] === 'card:action',
    							'mdc-dialog__button': /*context*/ ctx[17] === 'dialog:action',
    							'mdc-top-app-bar__navigation-icon': /*context*/ ctx[17] === 'top-app-bar:navigation',
    							'mdc-top-app-bar__action-item': /*context*/ ctx[17] === 'top-app-bar:action',
    							'mdc-snackbar__action': /*context*/ ctx[17] === 'snackbar:actions',
    							'mdc-banner__secondary-action': /*context*/ ctx[17] === 'banner' && /*secondary*/ ctx[8],
    							'mdc-banner__primary-action': /*context*/ ctx[17] === 'banner' && !/*secondary*/ ctx[8],
    							'mdc-tooltip__action': /*context*/ ctx[17] === 'tooltip:rich-actions',
    							.../*internalClasses*/ ctx[11]
    						})
    					},
    					dirty & /*Object, internalStyles, style*/ 4100 && {
    						style: Object.entries(/*internalStyles*/ ctx[12]).map(func$2).concat([/*style*/ ctx[2]]).join(' ')
    					},
    					dirty & /*actionProp*/ 32768 && get_spread_object(/*actionProp*/ ctx[15]),
    					dirty & /*defaultProp*/ 16384 && get_spread_object(/*defaultProp*/ ctx[14]),
    					dirty & /*secondaryProp*/ 8192 && get_spread_object(/*secondaryProp*/ ctx[13]),
    					dirty & /*href*/ 128 && { href: /*href*/ ctx[7] },
    					dirty & /*$$restProps*/ 4194304 && get_spread_object(/*$$restProps*/ ctx[22])
    				])
    			: {};

    			if (dirty & /*$$scope, touch*/ 536870976) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[9])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[28](switch_instance);
    					switch_instance.$on("click", /*handleClick*/ ctx[21]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[28](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$2 = ([name, value]) => `${name}: ${value};`;

    function instance$c($$self, $$props, $$invalidate) {
    	let actionProp;
    	let defaultProp;
    	let secondaryProp;

    	const omit_props_names = [
    		"use","class","style","ripple","color","variant","touch","href","action","defaultAction","secondary","component","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { ripple = true } = $$props;
    	let { color = 'primary' } = $$props;
    	let { variant = 'text' } = $$props;
    	let { touch = false } = $$props;
    	let { href = undefined } = $$props;
    	let { action = 'close' } = $$props;
    	let { defaultAction = false } = $$props;
    	let { secondary = false } = $$props;
    	let element;
    	let internalClasses = {};
    	let internalStyles = {};
    	let context = getContext('SMUI:button:context');
    	let { component = href == null ? Button : A } = $$props;
    	let previousDisabled = $$restProps.disabled;
    	setContext('SMUI:label:context', 'button');
    	setContext('SMUI:icon:context', 'button');

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(12, internalStyles);
    			} else {
    				$$invalidate(12, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function handleClick() {
    		if (context === 'banner') {
    			dispatch(getElement(), secondary
    			? 'SMUIBannerButton:secondaryActionClick'
    			: 'SMUIBannerButton:primaryActionClick');
    		}
    	}

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(10, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(30, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(22, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ('ripple' in $$new_props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('color' in $$new_props) $$invalidate(4, color = $$new_props.color);
    		if ('variant' in $$new_props) $$invalidate(5, variant = $$new_props.variant);
    		if ('touch' in $$new_props) $$invalidate(6, touch = $$new_props.touch);
    		if ('href' in $$new_props) $$invalidate(7, href = $$new_props.href);
    		if ('action' in $$new_props) $$invalidate(23, action = $$new_props.action);
    		if ('defaultAction' in $$new_props) $$invalidate(24, defaultAction = $$new_props.defaultAction);
    		if ('secondary' in $$new_props) $$invalidate(8, secondary = $$new_props.secondary);
    		if ('component' in $$new_props) $$invalidate(9, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(29, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		dispatch,
    		Ripple,
    		A,
    		Button,
    		forwardEvents,
    		use,
    		className,
    		style,
    		ripple,
    		color,
    		variant,
    		touch,
    		href,
    		action,
    		defaultAction,
    		secondary,
    		element,
    		internalClasses,
    		internalStyles,
    		context,
    		component,
    		previousDisabled,
    		addClass,
    		removeClass,
    		addStyle,
    		handleClick,
    		getElement,
    		secondaryProp,
    		defaultProp,
    		actionProp
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(30, $$props = assign(assign({}, $$props), $$new_props));
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(2, style = $$new_props.style);
    		if ('ripple' in $$props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('color' in $$props) $$invalidate(4, color = $$new_props.color);
    		if ('variant' in $$props) $$invalidate(5, variant = $$new_props.variant);
    		if ('touch' in $$props) $$invalidate(6, touch = $$new_props.touch);
    		if ('href' in $$props) $$invalidate(7, href = $$new_props.href);
    		if ('action' in $$props) $$invalidate(23, action = $$new_props.action);
    		if ('defaultAction' in $$props) $$invalidate(24, defaultAction = $$new_props.defaultAction);
    		if ('secondary' in $$props) $$invalidate(8, secondary = $$new_props.secondary);
    		if ('element' in $$props) $$invalidate(10, element = $$new_props.element);
    		if ('internalClasses' in $$props) $$invalidate(11, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(12, internalStyles = $$new_props.internalStyles);
    		if ('context' in $$props) $$invalidate(17, context = $$new_props.context);
    		if ('component' in $$props) $$invalidate(9, component = $$new_props.component);
    		if ('previousDisabled' in $$props) $$invalidate(26, previousDisabled = $$new_props.previousDisabled);
    		if ('secondaryProp' in $$props) $$invalidate(13, secondaryProp = $$new_props.secondaryProp);
    		if ('defaultProp' in $$props) $$invalidate(14, defaultProp = $$new_props.defaultProp);
    		if ('actionProp' in $$props) $$invalidate(15, actionProp = $$new_props.actionProp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(15, actionProp = context === 'dialog:action' && action != null
    		? { 'data-mdc-dialog-action': action }
    		: { action: $$props.action });

    		$$invalidate(14, defaultProp = context === 'dialog:action' && defaultAction
    		? { 'data-mdc-dialog-button-default': '' }
    		: { default: $$props.default });

    		$$invalidate(13, secondaryProp = context === 'banner'
    		? {}
    		: { secondary: $$props.secondary });

    		if (previousDisabled !== $$restProps.disabled) {
    			getElement().blur();
    			$$invalidate(26, previousDisabled = $$restProps.disabled);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		use,
    		className,
    		style,
    		ripple,
    		color,
    		variant,
    		touch,
    		href,
    		secondary,
    		component,
    		element,
    		internalClasses,
    		internalStyles,
    		secondaryProp,
    		defaultProp,
    		actionProp,
    		forwardEvents,
    		context,
    		addClass,
    		removeClass,
    		addStyle,
    		handleClick,
    		$$restProps,
    		action,
    		defaultAction,
    		getElement,
    		previousDisabled,
    		slots,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class Button_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$e, safe_not_equal, {
    			use: 0,
    			class: 1,
    			style: 2,
    			ripple: 3,
    			color: 4,
    			variant: 5,
    			touch: 6,
    			href: 7,
    			action: 23,
    			defaultAction: 24,
    			secondary: 8,
    			component: 9,
    			getElement: 25
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button_1",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get use() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variant() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get touch() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set touch(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get action() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultAction() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultAction(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondary() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondary(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[25];
    	}

    	set getElement(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\CommonLabel.svelte generated by Svelte v3.44.3 */

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     'mdc-button__label': context === 'button',     'mdc-fab__label': context === 'fab',     'mdc-tab__text-label': context === 'tab',     'mdc-image-list__label': context === 'image-list',     'mdc-snackbar__label': context === 'snackbar',     'mdc-banner__text': context === 'banner',     'mdc-segmented-button__label': context === 'segmented-button',     'mdc-data-table__pagination-rows-per-page-label':       context === 'data-table:pagination',     'mdc-data-table__header-cell-label':       context === 'data-table:sortable-header-cell',   })}   {...context === 'snackbar' ? { 'aria-atomic': 'false' } : {}}   {tabindex}   {...$$restProps}>
    function create_default_slot$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     'mdc-button__label': context === 'button',     'mdc-fab__label': context === 'fab',     'mdc-tab__text-label': context === 'tab',     'mdc-image-list__label': context === 'image-list',     'mdc-snackbar__label': context === 'snackbar',     'mdc-banner__text': context === 'banner',     'mdc-segmented-button__label': context === 'segmented-button',     'mdc-data-table__pagination-rows-per-page-label':       context === 'data-table:pagination',     'mdc-data-table__header-cell-label':       context === 'data-table:sortable-header-cell',   })}   {...context === 'snackbar' ? { 'aria-atomic': 'false' } : {}}   {tabindex}   {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [/*forwardEvents*/ ctx[4], .../*use*/ ctx[0]]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-button__label': /*context*/ ctx[5] === 'button',
    				'mdc-fab__label': /*context*/ ctx[5] === 'fab',
    				'mdc-tab__text-label': /*context*/ ctx[5] === 'tab',
    				'mdc-image-list__label': /*context*/ ctx[5] === 'image-list',
    				'mdc-snackbar__label': /*context*/ ctx[5] === 'snackbar',
    				'mdc-banner__text': /*context*/ ctx[5] === 'banner',
    				'mdc-segmented-button__label': /*context*/ ctx[5] === 'segmented-button',
    				'mdc-data-table__pagination-rows-per-page-label': /*context*/ ctx[5] === 'data-table:pagination',
    				'mdc-data-table__header-cell-label': /*context*/ ctx[5] === 'data-table:sortable-header-cell'
    			})
    		},
    		/*context*/ ctx[5] === 'snackbar'
    		? { 'aria-atomic': 'false' }
    		: {},
    		{ tabindex: /*tabindex*/ ctx[6] },
    		/*$$restProps*/ ctx[7]
    	];

    	var switch_value = /*component*/ ctx[2];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$6] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[10](switch_instance);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*forwardEvents, use, classMap, className, context, tabindex, $$restProps*/ 243)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*forwardEvents, use*/ 17 && {
    						use: [/*forwardEvents*/ ctx[4], .../*use*/ ctx[0]]
    					},
    					dirty & /*classMap, className, context*/ 34 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							'mdc-button__label': /*context*/ ctx[5] === 'button',
    							'mdc-fab__label': /*context*/ ctx[5] === 'fab',
    							'mdc-tab__text-label': /*context*/ ctx[5] === 'tab',
    							'mdc-image-list__label': /*context*/ ctx[5] === 'image-list',
    							'mdc-snackbar__label': /*context*/ ctx[5] === 'snackbar',
    							'mdc-banner__text': /*context*/ ctx[5] === 'banner',
    							'mdc-segmented-button__label': /*context*/ ctx[5] === 'segmented-button',
    							'mdc-data-table__pagination-rows-per-page-label': /*context*/ ctx[5] === 'data-table:pagination',
    							'mdc-data-table__header-cell-label': /*context*/ ctx[5] === 'data-table:sortable-header-cell'
    						})
    					},
    					dirty & /*context*/ 32 && get_spread_object(/*context*/ ctx[5] === 'snackbar'
    					? { 'aria-atomic': 'false' }
    					: {}),
    					dirty & /*tabindex*/ 64 && { tabindex: /*tabindex*/ ctx[6] },
    					dirty & /*$$restProps*/ 128 && get_spread_object(/*$$restProps*/ ctx[7])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 2048) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[10](switch_instance);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[10](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","component","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CommonLabel', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let element;
    	let { component = Span } = $$props;
    	const context = getContext('SMUI:label:context');
    	const tabindex = getContext('SMUI:label:tabindex');

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(3, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('component' in $$new_props) $$invalidate(2, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		Span,
    		forwardEvents,
    		use,
    		className,
    		element,
    		component,
    		context,
    		tabindex,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(3, element = $$new_props.element);
    		if ('component' in $$props) $$invalidate(2, component = $$new_props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		component,
    		element,
    		forwardEvents,
    		context,
    		tabindex,
    		$$restProps,
    		getElement,
    		slots,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class CommonLabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$d, safe_not_equal, {
    			use: 0,
    			class: 1,
    			component: 2,
    			getElement: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommonLabel",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get use() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[8];
    	}

    	set getElement(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const Label = CommonLabel;

    /* src\components\ButtonIcgc.svelte generated by Svelte v3.44.3 */
    const file$c = "src\\components\\ButtonIcgc.svelte";

    // (36:4) <Label >
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*label*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 1) set_data_dev(t, /*label*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(36:4) <Label >",
    		ctx
    	});

    	return block;
    }

    // (35:0) <Button on:click={onClick} style="background: #c8ffe7">
    function create_default_slot$5(ctx) {
    	let label_1;
    	let current;

    	label_1 = new Label({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_1_changes = {};

    			if (dirty & /*$$scope, label*/ 9) {
    				label_1_changes.$$scope = { dirty, ctx };
    			}

    			label_1.$set(label_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(35:0) <Button on:click={onClick} style=\\\"background: #c8ffe7\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let link0;
    	let link1;
    	let link2;
    	let link3;
    	let t;
    	let button;
    	let current;

    	button = new Button_1({
    			props: {
    				style: "background: #c8ffe7",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*onClick*/ ctx[1]);

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			link2 = element("link");
    			link3 = element("link");
    			t = space();
    			create_component(button.$$.fragment);
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "href", "https://fonts.googleapis.com/icon?family=Material+Icons");
    			add_location(link0, file$c, 14, 18, 357);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", "https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700");
    			add_location(link1, file$c, 18, 4, 474);
    			attr_dev(link2, "rel", "stylesheet");
    			attr_dev(link2, "href", "https://unpkg.com/@material/typography@13.0.0/dist/mdc.typography.css");
    			add_location(link2, file$c, 23, 32, 632);
    			attr_dev(link3, "rel", "stylesheet");
    			attr_dev(link3, "href", "https://unpkg.com/svelte-material-ui/bare.css");
    			add_location(link3, file$c, 28, 17, 778);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    			append_dev(document.head, link2);
    			append_dev(document.head, link3);
    			insert_dev(target, t, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope, label*/ 9) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    			detach_dev(link2);
    			detach_dev(link3);
    			if (detaching) detach_dev(t);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ButtonIcgc', slots, []);
    	let { label = "ok" } = $$props;
    	const dispatch = createEventDispatcher();

    	/**
     * Button click handler
     */
    	function onClick(event) {
    		dispatch("click", event);
    	}

    	const writable_props = ['label'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ButtonIcgc> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Button: Button_1,
    		Label,
    		label,
    		dispatch,
    		onClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, onClick];
    }

    class ButtonIcgc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$c, safe_not_equal, { label: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonIcgc",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get label() {
    		throw new Error("<ButtonIcgc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<ButtonIcgc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\LogoIcgc.svelte generated by Svelte v3.44.3 */

    const file$b = "src\\components\\LogoIcgc.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let a;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			img = element("img");
    			attr_dev(img, "width", /*width*/ ctx[0]);
    			attr_dev(img, "alt", /*title*/ ctx[1]);
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			add_location(img, file$b, 15, 4, 543);
    			attr_dev(a, "title", /*title*/ ctx[1]);
    			attr_dev(a, "rel", "noopener noreferrer");
    			attr_dev(a, "href", /*href*/ ctx[2]);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$b, 14, 2, 477);
    			attr_dev(div, "style", /*style*/ ctx[4]);
    			add_location(div, file$b, 13, 0, 460);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width*/ 1) {
    				attr_dev(img, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*title*/ 2) {
    				attr_dev(img, "alt", /*title*/ ctx[1]);
    			}

    			if (dirty & /*src*/ 8 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*title*/ 2) {
    				attr_dev(a, "title", /*title*/ ctx[1]);
    			}

    			if (dirty & /*href*/ 4) {
    				attr_dev(a, "href", /*href*/ ctx[2]);
    			}

    			if (dirty & /*style*/ 16) {
    				attr_dev(div, "style", /*style*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LogoIcgc', slots, []);
    	let { width = 125 } = $$props;
    	let { title = "Institut Cartogràfic i Geològic de Catalunya" } = $$props;

    	const typeList = {
    		color: "ICGC_color_norma.svg",
    		white: "ICGC_white_norma.svg"
    	};

    	let { type = "color" } = $$props;
    	let { href = "https://www.icgc.cat" } = $$props;
    	let { src = `https://betaserver.icgc.cat/logos/${typeList[type]}` } = $$props;
    	let { style = "position: absolute;z-index: 1000;right: 50px;bottom:10px" } = $$props;
    	const writable_props = ['width', 'title', 'type', 'href', 'src', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LogoIcgc> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('type' in $$props) $$invalidate(6, type = $$props.type);
    		if ('href' in $$props) $$invalidate(2, href = $$props.href);
    		if ('src' in $$props) $$invalidate(3, src = $$props.src);
    		if ('style' in $$props) $$invalidate(4, style = $$props.style);
    	};

    	$$self.$capture_state = () => ({
    		width,
    		title,
    		typeList,
    		type,
    		href,
    		src,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('type' in $$props) $$invalidate(6, type = $$props.type);
    		if ('href' in $$props) $$invalidate(2, href = $$props.href);
    		if ('src' in $$props) $$invalidate(3, src = $$props.src);
    		if ('style' in $$props) $$invalidate(4, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, title, href, src, style, typeList, type];
    }

    class LogoIcgc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$b, safe_not_equal, {
    			width: 0,
    			title: 1,
    			typeList: 5,
    			type: 6,
    			href: 2,
    			src: 3,
    			style: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LogoIcgc",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get width() {
    		throw new Error("<LogoIcgc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<LogoIcgc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<LogoIcgc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<LogoIcgc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get typeList() {
    		return this.$$.ctx[5];
    	}

    	set typeList(value) {
    		throw new Error("<LogoIcgc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<LogoIcgc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<LogoIcgc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<LogoIcgc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<LogoIcgc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get src() {
    		throw new Error("<LogoIcgc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<LogoIcgc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<LogoIcgc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<LogoIcgc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$1 = {
        ANIM_CHECKED_INDETERMINATE: 'mdc-checkbox--anim-checked-indeterminate',
        ANIM_CHECKED_UNCHECKED: 'mdc-checkbox--anim-checked-unchecked',
        ANIM_INDETERMINATE_CHECKED: 'mdc-checkbox--anim-indeterminate-checked',
        ANIM_INDETERMINATE_UNCHECKED: 'mdc-checkbox--anim-indeterminate-unchecked',
        ANIM_UNCHECKED_CHECKED: 'mdc-checkbox--anim-unchecked-checked',
        ANIM_UNCHECKED_INDETERMINATE: 'mdc-checkbox--anim-unchecked-indeterminate',
        BACKGROUND: 'mdc-checkbox__background',
        CHECKED: 'mdc-checkbox--checked',
        CHECKMARK: 'mdc-checkbox__checkmark',
        CHECKMARK_PATH: 'mdc-checkbox__checkmark-path',
        DISABLED: 'mdc-checkbox--disabled',
        INDETERMINATE: 'mdc-checkbox--indeterminate',
        MIXEDMARK: 'mdc-checkbox__mixedmark',
        NATIVE_CONTROL: 'mdc-checkbox__native-control',
        ROOT: 'mdc-checkbox',
        SELECTED: 'mdc-checkbox--selected',
        UPGRADED: 'mdc-checkbox--upgraded',
    };
    var strings$1 = {
        ARIA_CHECKED_ATTR: 'aria-checked',
        ARIA_CHECKED_INDETERMINATE_VALUE: 'mixed',
        DATA_INDETERMINATE_ATTR: 'data-indeterminate',
        NATIVE_CONTROL_SELECTOR: '.mdc-checkbox__native-control',
        TRANSITION_STATE_CHECKED: 'checked',
        TRANSITION_STATE_INDETERMINATE: 'indeterminate',
        TRANSITION_STATE_INIT: 'init',
        TRANSITION_STATE_UNCHECKED: 'unchecked',
    };
    var numbers = {
        ANIM_END_LATCH_MS: 250,
    };

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCCheckboxFoundation = /** @class */ (function (_super) {
        __extends(MDCCheckboxFoundation, _super);
        function MDCCheckboxFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCCheckboxFoundation.defaultAdapter), adapter)) || this;
            _this.currentCheckState = strings$1.TRANSITION_STATE_INIT;
            _this.currentAnimationClass = '';
            _this.animEndLatchTimer = 0;
            _this.enableAnimationEndHandler = false;
            return _this;
        }
        Object.defineProperty(MDCCheckboxFoundation, "cssClasses", {
            get: function () {
                return cssClasses$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCCheckboxFoundation, "strings", {
            get: function () {
                return strings$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCCheckboxFoundation, "numbers", {
            get: function () {
                return numbers;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCCheckboxFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    forceLayout: function () { return undefined; },
                    hasNativeControl: function () { return false; },
                    isAttachedToDOM: function () { return false; },
                    isChecked: function () { return false; },
                    isIndeterminate: function () { return false; },
                    removeClass: function () { return undefined; },
                    removeNativeControlAttr: function () { return undefined; },
                    setNativeControlAttr: function () { return undefined; },
                    setNativeControlDisabled: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCCheckboxFoundation.prototype.init = function () {
            this.currentCheckState = this.determineCheckState();
            this.updateAriaChecked();
            this.adapter.addClass(cssClasses$1.UPGRADED);
        };
        MDCCheckboxFoundation.prototype.destroy = function () {
            clearTimeout(this.animEndLatchTimer);
        };
        MDCCheckboxFoundation.prototype.setDisabled = function (disabled) {
            this.adapter.setNativeControlDisabled(disabled);
            if (disabled) {
                this.adapter.addClass(cssClasses$1.DISABLED);
            }
            else {
                this.adapter.removeClass(cssClasses$1.DISABLED);
            }
        };
        /**
         * Handles the animationend event for the checkbox
         */
        MDCCheckboxFoundation.prototype.handleAnimationEnd = function () {
            var _this = this;
            if (!this.enableAnimationEndHandler) {
                return;
            }
            clearTimeout(this.animEndLatchTimer);
            this.animEndLatchTimer = setTimeout(function () {
                _this.adapter.removeClass(_this.currentAnimationClass);
                _this.enableAnimationEndHandler = false;
            }, numbers.ANIM_END_LATCH_MS);
        };
        /**
         * Handles the change event for the checkbox
         */
        MDCCheckboxFoundation.prototype.handleChange = function () {
            this.transitionCheckState();
        };
        MDCCheckboxFoundation.prototype.transitionCheckState = function () {
            if (!this.adapter.hasNativeControl()) {
                return;
            }
            var oldState = this.currentCheckState;
            var newState = this.determineCheckState();
            if (oldState === newState) {
                return;
            }
            this.updateAriaChecked();
            var TRANSITION_STATE_UNCHECKED = strings$1.TRANSITION_STATE_UNCHECKED;
            var SELECTED = cssClasses$1.SELECTED;
            if (newState === TRANSITION_STATE_UNCHECKED) {
                this.adapter.removeClass(SELECTED);
            }
            else {
                this.adapter.addClass(SELECTED);
            }
            // Check to ensure that there isn't a previously existing animation class, in case for example
            // the user interacted with the checkbox before the animation was finished.
            if (this.currentAnimationClass.length > 0) {
                clearTimeout(this.animEndLatchTimer);
                this.adapter.forceLayout();
                this.adapter.removeClass(this.currentAnimationClass);
            }
            this.currentAnimationClass =
                this.getTransitionAnimationClass(oldState, newState);
            this.currentCheckState = newState;
            // Check for parentNode so that animations are only run when the element is attached
            // to the DOM.
            if (this.adapter.isAttachedToDOM() &&
                this.currentAnimationClass.length > 0) {
                this.adapter.addClass(this.currentAnimationClass);
                this.enableAnimationEndHandler = true;
            }
        };
        MDCCheckboxFoundation.prototype.determineCheckState = function () {
            var TRANSITION_STATE_INDETERMINATE = strings$1.TRANSITION_STATE_INDETERMINATE, TRANSITION_STATE_CHECKED = strings$1.TRANSITION_STATE_CHECKED, TRANSITION_STATE_UNCHECKED = strings$1.TRANSITION_STATE_UNCHECKED;
            if (this.adapter.isIndeterminate()) {
                return TRANSITION_STATE_INDETERMINATE;
            }
            return this.adapter.isChecked() ? TRANSITION_STATE_CHECKED :
                TRANSITION_STATE_UNCHECKED;
        };
        MDCCheckboxFoundation.prototype.getTransitionAnimationClass = function (oldState, newState) {
            var TRANSITION_STATE_INIT = strings$1.TRANSITION_STATE_INIT, TRANSITION_STATE_CHECKED = strings$1.TRANSITION_STATE_CHECKED, TRANSITION_STATE_UNCHECKED = strings$1.TRANSITION_STATE_UNCHECKED;
            var _a = MDCCheckboxFoundation.cssClasses, ANIM_UNCHECKED_CHECKED = _a.ANIM_UNCHECKED_CHECKED, ANIM_UNCHECKED_INDETERMINATE = _a.ANIM_UNCHECKED_INDETERMINATE, ANIM_CHECKED_UNCHECKED = _a.ANIM_CHECKED_UNCHECKED, ANIM_CHECKED_INDETERMINATE = _a.ANIM_CHECKED_INDETERMINATE, ANIM_INDETERMINATE_CHECKED = _a.ANIM_INDETERMINATE_CHECKED, ANIM_INDETERMINATE_UNCHECKED = _a.ANIM_INDETERMINATE_UNCHECKED;
            switch (oldState) {
                case TRANSITION_STATE_INIT:
                    if (newState === TRANSITION_STATE_UNCHECKED) {
                        return '';
                    }
                    return newState === TRANSITION_STATE_CHECKED ? ANIM_INDETERMINATE_CHECKED : ANIM_INDETERMINATE_UNCHECKED;
                case TRANSITION_STATE_UNCHECKED:
                    return newState === TRANSITION_STATE_CHECKED ? ANIM_UNCHECKED_CHECKED : ANIM_UNCHECKED_INDETERMINATE;
                case TRANSITION_STATE_CHECKED:
                    return newState === TRANSITION_STATE_UNCHECKED ? ANIM_CHECKED_UNCHECKED : ANIM_CHECKED_INDETERMINATE;
                default: // TRANSITION_STATE_INDETERMINATE
                    return newState === TRANSITION_STATE_CHECKED ? ANIM_INDETERMINATE_CHECKED : ANIM_INDETERMINATE_UNCHECKED;
            }
        };
        MDCCheckboxFoundation.prototype.updateAriaChecked = function () {
            // Ensure aria-checked is set to mixed if checkbox is in indeterminate state.
            if (this.adapter.isIndeterminate()) {
                this.adapter.setNativeControlAttr(strings$1.ARIA_CHECKED_ATTR, strings$1.ARIA_CHECKED_INDETERMINATE_VALUE);
            }
            else {
                // The on/off state does not need to keep track of aria-checked, since
                // the screenreader uses the checked property on the checkbox element.
                this.adapter.removeNativeControlAttr(strings$1.ARIA_CHECKED_ATTR);
            }
        };
        return MDCCheckboxFoundation;
    }(MDCFoundation));

    /* node_modules\@smui\checkbox\dist\Checkbox.svelte generated by Svelte v3.44.3 */
    const file$a = "node_modules\\@smui\\checkbox\\dist\\Checkbox.svelte";

    function create_fragment$a(ctx) {
    	let div3;
    	let input;
    	let input_class_value;
    	let input_value_value;
    	let input_data_indeterminate_value;
    	let useActions_action;
    	let t0;
    	let div1;
    	let svg;
    	let path;
    	let t1;
    	let div0;
    	let t2;
    	let div2;
    	let div3_class_value;
    	let div3_style_value;
    	let useActions_action_1;
    	let Ripple_action;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{
    			class: input_class_value = classMap({
    				[/*input$class*/ ctx[9]]: true,
    				'mdc-checkbox__native-control': true
    			})
    		},
    		{ type: "checkbox" },
    		/*inputProps*/ ctx[20],
    		{ disabled: /*disabled*/ ctx[1] },
    		{
    			__value: input_value_value = /*isUninitializedValue*/ ctx[19](/*valueKey*/ ctx[7])
    			? /*value*/ ctx[6]
    			: /*valueKey*/ ctx[7]
    		},
    		{
    			"data-indeterminate": input_data_indeterminate_value = !/*isUninitializedValue*/ ctx[19](/*indeterminate*/ ctx[0]) && /*indeterminate*/ ctx[0]
    			? 'true'
    			: undefined
    		},
    		/*nativeControlAttrs*/ ctx[16],
    		prefixFilter(/*$$restProps*/ ctx[26], 'input$')
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let div3_levels = [
    		{
    			class: div3_class_value = classMap({
    				[/*className*/ ctx[3]]: true,
    				'mdc-checkbox': true,
    				'mdc-checkbox--disabled': /*disabled*/ ctx[1],
    				'mdc-checkbox--touch': /*touch*/ ctx[5],
    				'mdc-data-table__header-row-checkbox': /*context*/ ctx[21] === 'data-table' && /*dataTableHeader*/ ctx[22],
    				'mdc-data-table__row-checkbox': /*context*/ ctx[21] === 'data-table' && !/*dataTableHeader*/ ctx[22],
    				.../*internalClasses*/ ctx[14]
    			})
    		},
    		{
    			style: div3_style_value = Object.entries(/*internalStyles*/ ctx[15]).map(func$1).concat([/*style*/ ctx[4]]).join(' ')
    		},
    		exclude(/*$$restProps*/ ctx[26], ['input$'])
    	];

    	let div3_data = {};

    	for (let i = 0; i < div3_levels.length; i += 1) {
    		div3_data = assign(div3_data, div3_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			input = element("input");
    			t0 = space();
    			div1 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			div2 = element("div");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 30, 2, 804);
    			attr_dev(path, "class", "mdc-checkbox__checkmark-path");
    			attr_dev(path, "fill", "none");
    			attr_dev(path, "d", "M1.73,12.91 8.1,19.28 22.79,4.59");
    			add_location(path, file$a, 52, 6, 1442);
    			attr_dev(svg, "class", "mdc-checkbox__checkmark");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$a, 51, 4, 1378);
    			attr_dev(div0, "class", "mdc-checkbox__mixedmark");
    			add_location(div0, file$a, 58, 4, 1582);
    			attr_dev(div1, "class", "mdc-checkbox__background");
    			add_location(div1, file$a, 50, 2, 1335);
    			attr_dev(div2, "class", "mdc-checkbox__ripple");
    			add_location(div2, file$a, 60, 2, 1633);
    			set_attributes(div3, div3_data);
    			add_location(div3, file$a, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, input);
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[36](input);
    			input.checked = /*nativeChecked*/ ctx[12];
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, svg);
    			append_dev(svg, path);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			/*div3_binding*/ ctx[38](div3);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, input, /*input$use*/ ctx[8])),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[37]),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[34], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[35], false, false, false),
    					action_destroyer(useActions_action_1 = useActions.call(null, div3, /*use*/ ctx[2])),
    					action_destroyer(/*forwardEvents*/ ctx[18].call(null, div3)),
    					action_destroyer(Ripple_action = Ripple.call(null, div3, {
    						unbounded: true,
    						addClass: /*addClass*/ ctx[23],
    						removeClass: /*removeClass*/ ctx[24],
    						addStyle: /*addStyle*/ ctx[25],
    						active: /*rippleActive*/ ctx[17],
    						eventTarget: /*checkbox*/ ctx[11]
    					})),
    					listen_dev(div3, "animationend", /*animationend_handler*/ ctx[39], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*input$class*/ 512 && input_class_value !== (input_class_value = classMap({
    					[/*input$class*/ ctx[9]]: true,
    					'mdc-checkbox__native-control': true
    				})) && { class: input_class_value },
    				{ type: "checkbox" },
    				/*inputProps*/ ctx[20],
    				dirty[0] & /*disabled*/ 2 && { disabled: /*disabled*/ ctx[1] },
    				dirty[0] & /*valueKey, value*/ 192 && input_value_value !== (input_value_value = /*isUninitializedValue*/ ctx[19](/*valueKey*/ ctx[7])
    				? /*value*/ ctx[6]
    				: /*valueKey*/ ctx[7]) && { __value: input_value_value },
    				dirty[0] & /*indeterminate*/ 1 && input_data_indeterminate_value !== (input_data_indeterminate_value = !/*isUninitializedValue*/ ctx[19](/*indeterminate*/ ctx[0]) && /*indeterminate*/ ctx[0]
    				? 'true'
    				: undefined) && {
    					"data-indeterminate": input_data_indeterminate_value
    				},
    				dirty[0] & /*nativeControlAttrs*/ 65536 && /*nativeControlAttrs*/ ctx[16],
    				dirty[0] & /*$$restProps*/ 67108864 && prefixFilter(/*$$restProps*/ ctx[26], 'input$')
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*input$use*/ 256) useActions_action.update.call(null, /*input$use*/ ctx[8]);

    			if (dirty[0] & /*nativeChecked*/ 4096) {
    				input.checked = /*nativeChecked*/ ctx[12];
    			}

    			set_attributes(div3, div3_data = get_spread_update(div3_levels, [
    				dirty[0] & /*className, disabled, touch, internalClasses*/ 16426 && div3_class_value !== (div3_class_value = classMap({
    					[/*className*/ ctx[3]]: true,
    					'mdc-checkbox': true,
    					'mdc-checkbox--disabled': /*disabled*/ ctx[1],
    					'mdc-checkbox--touch': /*touch*/ ctx[5],
    					'mdc-data-table__header-row-checkbox': /*context*/ ctx[21] === 'data-table' && /*dataTableHeader*/ ctx[22],
    					'mdc-data-table__row-checkbox': /*context*/ ctx[21] === 'data-table' && !/*dataTableHeader*/ ctx[22],
    					.../*internalClasses*/ ctx[14]
    				})) && { class: div3_class_value },
    				dirty[0] & /*internalStyles, style*/ 32784 && div3_style_value !== (div3_style_value = Object.entries(/*internalStyles*/ ctx[15]).map(func$1).concat([/*style*/ ctx[4]]).join(' ')) && { style: div3_style_value },
    				dirty[0] & /*$$restProps*/ 67108864 && exclude(/*$$restProps*/ ctx[26], ['input$'])
    			]));

    			if (useActions_action_1 && is_function(useActions_action_1.update) && dirty[0] & /*use*/ 4) useActions_action_1.update.call(null, /*use*/ ctx[2]);

    			if (Ripple_action && is_function(Ripple_action.update) && dirty[0] & /*rippleActive, checkbox*/ 133120) Ripple_action.update.call(null, {
    				unbounded: true,
    				addClass: /*addClass*/ ctx[23],
    				removeClass: /*removeClass*/ ctx[24],
    				addStyle: /*addStyle*/ ctx[25],
    				active: /*rippleActive*/ ctx[17],
    				eventTarget: /*checkbox*/ ctx[11]
    			});
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			/*input_binding*/ ctx[36](null);
    			/*div3_binding*/ ctx[38](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$1 = ([name, value]) => `${name}: ${value};`;

    function instance_1$1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","disabled","touch","indeterminate","group","checked","value","valueKey","input$use","input$class","getId","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Checkbox', slots, []);
    	var _a;
    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	let uninitializedValue = () => {
    		
    	};

    	function isUninitializedValue(value) {
    		return value === uninitializedValue;
    	}

    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { disabled = false } = $$props;
    	let { touch = false } = $$props;
    	let { indeterminate = uninitializedValue } = $$props;
    	let { group = uninitializedValue } = $$props;
    	let { checked = uninitializedValue } = $$props;
    	let { value = null } = $$props;
    	let { valueKey = uninitializedValue } = $$props;
    	let { input$use = [] } = $$props;
    	let { input$class = '' } = $$props;
    	let element;
    	let instance;
    	let checkbox;
    	let internalClasses = {};
    	let internalStyles = {};
    	let nativeControlAttrs = {};
    	let rippleActive = false;

    	let inputProps = (_a = getContext('SMUI:generic:input:props')) !== null && _a !== void 0
    	? _a
    	: {};

    	let nativeChecked = isUninitializedValue(group)
    	? isUninitializedValue(checked)
    		? false
    		: checked !== null && checked !== void 0
    			? checked
    			: undefined
    	: group.indexOf(value) !== -1;

    	let context = getContext('SMUI:checkbox:context');
    	let dataTableHeader = getContext('SMUI:data-table:row:header');
    	let previousChecked = checked;
    	let previousGroup = isUninitializedValue(group) ? [] : [...group];
    	let previousNativeChecked = nativeChecked;

    	onMount(() => {
    		$$invalidate(11, checkbox.indeterminate = !isUninitializedValue(indeterminate) && indeterminate, checkbox);

    		$$invalidate(10, instance = new MDCCheckboxFoundation({
    				addClass,
    				forceLayout: () => element.offsetWidth,
    				hasNativeControl: () => true,
    				isAttachedToDOM: () => Boolean(element.parentNode),
    				isChecked: () => nativeChecked !== null && nativeChecked !== void 0
    				? nativeChecked
    				: false,
    				isIndeterminate: () => isUninitializedValue(indeterminate)
    				? false
    				: indeterminate,
    				removeClass,
    				removeNativeControlAttr,
    				setNativeControlAttr: addNativeControlAttr,
    				setNativeControlDisabled: value => $$invalidate(1, disabled = value)
    			}));

    		const accessor = {
    			_smui_checkbox_accessor: true,
    			get element() {
    				return getElement();
    			},
    			get checked() {
    				return nativeChecked !== null && nativeChecked !== void 0
    				? nativeChecked
    				: false;
    			},
    			set checked(value) {
    				if (nativeChecked !== value) {
    					$$invalidate(12, nativeChecked = value);
    				}
    			},
    			get indeterminate() {
    				return isUninitializedValue(indeterminate)
    				? false
    				: indeterminate;
    			},
    			set indeterminate(value) {
    				$$invalidate(0, indeterminate = value);
    			},
    			activateRipple() {
    				if (!disabled) {
    					$$invalidate(17, rippleActive = true);
    				}
    			},
    			deactivateRipple() {
    				$$invalidate(17, rippleActive = false);
    			}
    		};

    		dispatch(element, 'SMUIGenericInput:mount', accessor);
    		dispatch(element, 'SMUICheckbox:mount', accessor);
    		instance.init();

    		return () => {
    			dispatch(element, 'SMUIGenericInput:unmount', accessor);
    			dispatch(element, 'SMUICheckbox:unmount', accessor);
    			instance.destroy();
    		};
    	});

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(14, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(14, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(15, internalStyles);
    			} else {
    				$$invalidate(15, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function addNativeControlAttr(name, value) {
    		if (nativeControlAttrs[name] !== value) {
    			$$invalidate(16, nativeControlAttrs[name] = value, nativeControlAttrs);
    		}
    	}

    	function removeNativeControlAttr(name) {
    		if (!(name in nativeControlAttrs) || nativeControlAttrs[name] != null) {
    			$$invalidate(16, nativeControlAttrs[name] = undefined, nativeControlAttrs);
    		}
    	}

    	function getId() {
    		return inputProps && inputProps.id;
    	}

    	function getElement() {
    		return element;
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			checkbox = $$value;
    			((((((((($$invalidate(11, checkbox), $$invalidate(27, group)), $$invalidate(33, previousNativeChecked)), $$invalidate(12, nativeChecked)), $$invalidate(6, value)), $$invalidate(32, previousGroup)), $$invalidate(28, checked)), $$invalidate(31, previousChecked)), $$invalidate(0, indeterminate)), $$invalidate(10, instance));
    		});
    	}

    	function input_change_handler() {
    		nativeChecked = this.checked;
    		((((((((($$invalidate(12, nativeChecked), $$invalidate(27, group)), $$invalidate(33, previousNativeChecked)), $$invalidate(6, value)), $$invalidate(32, previousGroup)), $$invalidate(28, checked)), $$invalidate(31, previousChecked)), $$invalidate(0, indeterminate)), $$invalidate(11, checkbox)), $$invalidate(10, instance));
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(13, element);
    		});
    	}

    	const animationend_handler = () => instance && instance.handleAnimationEnd();

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(26, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(2, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('disabled' in $$new_props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ('touch' in $$new_props) $$invalidate(5, touch = $$new_props.touch);
    		if ('indeterminate' in $$new_props) $$invalidate(0, indeterminate = $$new_props.indeterminate);
    		if ('group' in $$new_props) $$invalidate(27, group = $$new_props.group);
    		if ('checked' in $$new_props) $$invalidate(28, checked = $$new_props.checked);
    		if ('value' in $$new_props) $$invalidate(6, value = $$new_props.value);
    		if ('valueKey' in $$new_props) $$invalidate(7, valueKey = $$new_props.valueKey);
    		if ('input$use' in $$new_props) $$invalidate(8, input$use = $$new_props.input$use);
    		if ('input$class' in $$new_props) $$invalidate(9, input$class = $$new_props.input$class);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		MDCCheckboxFoundation,
    		onMount,
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		Ripple,
    		forwardEvents,
    		uninitializedValue,
    		isUninitializedValue,
    		use,
    		className,
    		style,
    		disabled,
    		touch,
    		indeterminate,
    		group,
    		checked,
    		value,
    		valueKey,
    		input$use,
    		input$class,
    		element,
    		instance,
    		checkbox,
    		internalClasses,
    		internalStyles,
    		nativeControlAttrs,
    		rippleActive,
    		inputProps,
    		nativeChecked,
    		context,
    		dataTableHeader,
    		previousChecked,
    		previousGroup,
    		previousNativeChecked,
    		addClass,
    		removeClass,
    		addStyle,
    		addNativeControlAttr,
    		removeNativeControlAttr,
    		getId,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_a' in $$props) _a = $$new_props._a;
    		if ('uninitializedValue' in $$props) uninitializedValue = $$new_props.uninitializedValue;
    		if ('use' in $$props) $$invalidate(2, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ('touch' in $$props) $$invalidate(5, touch = $$new_props.touch);
    		if ('indeterminate' in $$props) $$invalidate(0, indeterminate = $$new_props.indeterminate);
    		if ('group' in $$props) $$invalidate(27, group = $$new_props.group);
    		if ('checked' in $$props) $$invalidate(28, checked = $$new_props.checked);
    		if ('value' in $$props) $$invalidate(6, value = $$new_props.value);
    		if ('valueKey' in $$props) $$invalidate(7, valueKey = $$new_props.valueKey);
    		if ('input$use' in $$props) $$invalidate(8, input$use = $$new_props.input$use);
    		if ('input$class' in $$props) $$invalidate(9, input$class = $$new_props.input$class);
    		if ('element' in $$props) $$invalidate(13, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(10, instance = $$new_props.instance);
    		if ('checkbox' in $$props) $$invalidate(11, checkbox = $$new_props.checkbox);
    		if ('internalClasses' in $$props) $$invalidate(14, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(15, internalStyles = $$new_props.internalStyles);
    		if ('nativeControlAttrs' in $$props) $$invalidate(16, nativeControlAttrs = $$new_props.nativeControlAttrs);
    		if ('rippleActive' in $$props) $$invalidate(17, rippleActive = $$new_props.rippleActive);
    		if ('inputProps' in $$props) $$invalidate(20, inputProps = $$new_props.inputProps);
    		if ('nativeChecked' in $$props) $$invalidate(12, nativeChecked = $$new_props.nativeChecked);
    		if ('context' in $$props) $$invalidate(21, context = $$new_props.context);
    		if ('dataTableHeader' in $$props) $$invalidate(22, dataTableHeader = $$new_props.dataTableHeader);
    		if ('previousChecked' in $$props) $$invalidate(31, previousChecked = $$new_props.previousChecked);
    		if ('previousGroup' in $$props) $$invalidate(32, previousGroup = $$new_props.previousGroup);
    		if ('previousNativeChecked' in $$props) $$invalidate(33, previousNativeChecked = $$new_props.previousNativeChecked);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*group, nativeChecked, value, checked, indeterminate, checkbox, instance*/ 402660417 | $$self.$$.dirty[1] & /*previousNativeChecked, previousGroup, previousChecked*/ 7) {
    			{
    				// This is a substitute for an on:change listener that is
    				// smarter about when it calls the instance's handler. I do
    				// this so that a group of changes will only trigger one
    				// handler call, since the handler will reset currently
    				// running animations.
    				let callHandleChange = false;

    				// First check for group state.
    				if (!isUninitializedValue(group)) {
    					if (previousNativeChecked !== nativeChecked) {
    						// The change needs to flow up.
    						const idx = group.indexOf(value);

    						if (nativeChecked && idx === -1) {
    							group.push(value);
    							((((((((($$invalidate(27, group), $$invalidate(33, previousNativeChecked)), $$invalidate(12, nativeChecked)), $$invalidate(6, value)), $$invalidate(32, previousGroup)), $$invalidate(28, checked)), $$invalidate(31, previousChecked)), $$invalidate(0, indeterminate)), $$invalidate(11, checkbox)), $$invalidate(10, instance));
    						} else if (!nativeChecked && idx !== -1) {
    							group.splice(idx, 1);
    							((((((((($$invalidate(27, group), $$invalidate(33, previousNativeChecked)), $$invalidate(12, nativeChecked)), $$invalidate(6, value)), $$invalidate(32, previousGroup)), $$invalidate(28, checked)), $$invalidate(31, previousChecked)), $$invalidate(0, indeterminate)), $$invalidate(11, checkbox)), $$invalidate(10, instance));
    						}

    						callHandleChange = true;
    					} else {
    						// Potential changes need to flow down.
    						const idxPrev = previousGroup.indexOf(value);

    						const idx = group.indexOf(value);

    						if (idxPrev > -1 && idx === -1) {
    							// The checkbox was removed from the group.
    							$$invalidate(12, nativeChecked = false);

    							callHandleChange = true;
    						} else if (idx > -1 && idxPrev === -1) {
    							// The checkbox was added to the group.
    							$$invalidate(12, nativeChecked = true);

    							callHandleChange = true;
    						}
    					}
    				}

    				// Now check individual state.
    				if (isUninitializedValue(checked)) {
    					if (!!previousNativeChecked !== !!nativeChecked) {
    						// The checkbox was clicked by the user.
    						callHandleChange = true;
    					}
    				} else if (checked !== (nativeChecked !== null && nativeChecked !== void 0
    				? nativeChecked
    				: null)) {
    					if (checked === previousChecked) {
    						// The checkbox was clicked by the user
    						// and the change needs to flow up.
    						$$invalidate(28, checked = nativeChecked !== null && nativeChecked !== void 0
    						? nativeChecked
    						: null);

    						if (!isUninitializedValue(indeterminate)) {
    							$$invalidate(0, indeterminate = false);
    						}
    					} else {
    						// The checkbox was changed programmatically
    						// and the change needs to flow down.
    						$$invalidate(12, nativeChecked = checked !== null && checked !== void 0
    						? checked
    						: undefined);
    					}

    					callHandleChange = true;
    				}

    				if (checkbox) {
    					// Sync indeterminate state with the native input.
    					if (isUninitializedValue(indeterminate)) {
    						if (checkbox.indeterminate) {
    							// I don't think this can happen, but just in case.
    							$$invalidate(11, checkbox.indeterminate = false, checkbox);

    							callHandleChange = true;
    						}
    					} else {
    						if (!indeterminate && checkbox.indeterminate) {
    							$$invalidate(11, checkbox.indeterminate = false, checkbox);
    							callHandleChange = true;
    						} else if (indeterminate && !checkbox.indeterminate) {
    							$$invalidate(11, checkbox.indeterminate = true, checkbox);
    							callHandleChange = true;
    						}
    					}
    				}

    				$$invalidate(31, previousChecked = checked);
    				$$invalidate(32, previousGroup = isUninitializedValue(group) ? [] : [...group]);
    				$$invalidate(33, previousNativeChecked = nativeChecked);

    				if (callHandleChange && instance) {
    					instance.handleChange();
    				}
    			}
    		}
    	};

    	return [
    		indeterminate,
    		disabled,
    		use,
    		className,
    		style,
    		touch,
    		value,
    		valueKey,
    		input$use,
    		input$class,
    		instance,
    		checkbox,
    		nativeChecked,
    		element,
    		internalClasses,
    		internalStyles,
    		nativeControlAttrs,
    		rippleActive,
    		forwardEvents,
    		isUninitializedValue,
    		inputProps,
    		context,
    		dataTableHeader,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		group,
    		checked,
    		getId,
    		getElement,
    		previousChecked,
    		previousGroup,
    		previousNativeChecked,
    		blur_handler,
    		focus_handler,
    		input_binding,
    		input_change_handler,
    		div3_binding,
    		animationend_handler
    	];
    }

    class Checkbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$1,
    			create_fragment$a,
    			safe_not_equal,
    			{
    				use: 2,
    				class: 3,
    				style: 4,
    				disabled: 1,
    				touch: 5,
    				indeterminate: 0,
    				group: 27,
    				checked: 28,
    				value: 6,
    				valueKey: 7,
    				input$use: 8,
    				input$class: 9,
    				getId: 29,
    				getElement: 30
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkbox",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get use() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get touch() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set touch(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indeterminate() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indeterminate(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueKey() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueKey(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input$use() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input$use(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input$class() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input$class(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getId() {
    		return this.$$.ctx[29];
    	}

    	set getId(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[30];
    	}

    	set getElement(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses = {
        ROOT: 'mdc-form-field',
    };
    var strings = {
        LABEL_SELECTOR: '.mdc-form-field > label',
    };

    /**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFormFieldFoundation = /** @class */ (function (_super) {
        __extends(MDCFormFieldFoundation, _super);
        function MDCFormFieldFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCFormFieldFoundation.defaultAdapter), adapter)) || this;
            _this.click = function () {
                _this.handleClick();
            };
            return _this;
        }
        Object.defineProperty(MDCFormFieldFoundation, "cssClasses", {
            get: function () {
                return cssClasses;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFormFieldFoundation, "strings", {
            get: function () {
                return strings;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFormFieldFoundation, "defaultAdapter", {
            get: function () {
                return {
                    activateInputRipple: function () { return undefined; },
                    deactivateInputRipple: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCFormFieldFoundation.prototype.init = function () {
            this.adapter.registerInteractionHandler('click', this.click);
        };
        MDCFormFieldFoundation.prototype.destroy = function () {
            this.adapter.deregisterInteractionHandler('click', this.click);
        };
        MDCFormFieldFoundation.prototype.handleClick = function () {
            var _this = this;
            this.adapter.activateInputRipple();
            requestAnimationFrame(function () {
                _this.adapter.deactivateInputRipple();
            });
        };
        return MDCFormFieldFoundation;
    }(MDCFoundation));

    /* node_modules\@smui\form-field\dist\FormField.svelte generated by Svelte v3.44.3 */

    const file$9 = "node_modules\\@smui\\form-field\\dist\\FormField.svelte";
    const get_label_slot_changes = dirty => ({});
    const get_label_slot_context = ctx => ({});

    function create_fragment$9(ctx) {
    	let div;
    	let t;
    	let label_1;
    	let useActions_action;
    	let div_class_value;
    	let useActions_action_1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	const label_slot_template = /*#slots*/ ctx[13].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[12], get_label_slot_context);
    	let label_1_levels = [{ for: /*inputId*/ ctx[4] }, prefixFilter(/*$$restProps*/ ctx[10], 'label$')];
    	let label_1_data = {};

    	for (let i = 0; i < label_1_levels.length; i += 1) {
    		label_1_data = assign(label_1_data, label_1_levels[i]);
    	}

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-form-field': true,
    				'mdc-form-field--align-end': /*align*/ ctx[2] === 'end',
    				'mdc-form-field--nowrap': /*noWrap*/ ctx[3]
    			})
    		},
    		exclude(/*$$restProps*/ ctx[10], ['label$'])
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			label_1 = element("label");
    			if (label_slot) label_slot.c();
    			set_attributes(label_1, label_1_data);
    			add_location(label_1, file$9, 15, 2, 412);
    			set_attributes(div, div_data);
    			add_location(div, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t);
    			append_dev(div, label_1);

    			if (label_slot) {
    				label_slot.m(label_1, null);
    			}

    			/*label_1_binding*/ ctx[14](label_1);
    			/*div_binding*/ ctx[15](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, label_1, /*label$use*/ ctx[5])),
    					action_destroyer(useActions_action_1 = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[9].call(null, div)),
    					listen_dev(div, "SMUIGenericInput:mount", /*SMUIGenericInput_mount_handler*/ ctx[16], false, false, false),
    					listen_dev(div, "SMUIGenericInput:unmount", /*SMUIGenericInput_unmount_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			if (label_slot) {
    				if (label_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[12], dirty, get_label_slot_changes),
    						get_label_slot_context
    					);
    				}
    			}

    			set_attributes(label_1, label_1_data = get_spread_update(label_1_levels, [
    				(!current || dirty & /*inputId*/ 16) && { for: /*inputId*/ ctx[4] },
    				dirty & /*$$restProps*/ 1024 && prefixFilter(/*$$restProps*/ ctx[10], 'label$')
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*label$use*/ 32) useActions_action.update.call(null, /*label$use*/ ctx[5]);

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className, align, noWrap*/ 14 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-form-field': true,
    					'mdc-form-field--align-end': /*align*/ ctx[2] === 'end',
    					'mdc-form-field--nowrap': /*noWrap*/ ctx[3]
    				}))) && { class: div_class_value },
    				dirty & /*$$restProps*/ 1024 && exclude(/*$$restProps*/ ctx[10], ['label$'])
    			]));

    			if (useActions_action_1 && is_function(useActions_action_1.update) && dirty & /*use*/ 1) useActions_action_1.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(label_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(label_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (label_slot) label_slot.d(detaching);
    			/*label_1_binding*/ ctx[14](null);
    			/*div_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let counter = 0;

    function instance_1($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","align","noWrap","inputId","label$use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormField', slots, ['default','label']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { align = 'start' } = $$props;
    	let { noWrap = false } = $$props;
    	let { inputId = 'SMUI-form-field-' + counter++ } = $$props;
    	let { label$use = [] } = $$props;
    	let element;
    	let instance;
    	let label;
    	let input;
    	setContext('SMUI:generic:input:props', { id: inputId });

    	onMount(() => {
    		instance = new MDCFormFieldFoundation({
    				activateInputRipple: () => {
    					if (input) {
    						input.activateRipple();
    					}
    				},
    				deactivateInputRipple: () => {
    					if (input) {
    						input.deactivateRipple();
    					}
    				},
    				deregisterInteractionHandler: (evtType, handler) => {
    					label.removeEventListener(evtType, handler);
    				},
    				registerInteractionHandler: (evtType, handler) => {
    					label.addEventListener(evtType, handler);
    				}
    			});

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function getElement() {
    		return element;
    	}

    	function label_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			label = $$value;
    			$$invalidate(7, label);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(6, element);
    		});
    	}

    	const SMUIGenericInput_mount_handler = event => $$invalidate(8, input = event.detail);
    	const SMUIGenericInput_unmount_handler = () => $$invalidate(8, input = undefined);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('align' in $$new_props) $$invalidate(2, align = $$new_props.align);
    		if ('noWrap' in $$new_props) $$invalidate(3, noWrap = $$new_props.noWrap);
    		if ('inputId' in $$new_props) $$invalidate(4, inputId = $$new_props.inputId);
    		if ('label$use' in $$new_props) $$invalidate(5, label$use = $$new_props.label$use);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		counter,
    		MDCFormFieldFoundation,
    		onMount,
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		align,
    		noWrap,
    		inputId,
    		label$use,
    		element,
    		instance,
    		label,
    		input,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('align' in $$props) $$invalidate(2, align = $$new_props.align);
    		if ('noWrap' in $$props) $$invalidate(3, noWrap = $$new_props.noWrap);
    		if ('inputId' in $$props) $$invalidate(4, inputId = $$new_props.inputId);
    		if ('label$use' in $$props) $$invalidate(5, label$use = $$new_props.label$use);
    		if ('element' in $$props) $$invalidate(6, element = $$new_props.element);
    		if ('instance' in $$props) instance = $$new_props.instance;
    		if ('label' in $$props) $$invalidate(7, label = $$new_props.label);
    		if ('input' in $$props) $$invalidate(8, input = $$new_props.input);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		align,
    		noWrap,
    		inputId,
    		label$use,
    		element,
    		label,
    		input,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		label_1_binding,
    		div_binding,
    		SMUIGenericInput_mount_handler,
    		SMUIGenericInput_unmount_handler
    	];
    }

    class FormField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1, create_fragment$9, safe_not_equal, {
    			use: 0,
    			class: 1,
    			align: 2,
    			noWrap: 3,
    			inputId: 4,
    			label$use: 5,
    			getElement: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormField",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get use() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noWrap() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noWrap(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputId() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputId(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label$use() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label$use(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[11];
    	}

    	set getElement(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\LayerTreeIcgc.svelte generated by Svelte v3.44.3 */
    const file$8 = "src\\components\\LayerTreeIcgc.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (44:12) <FormField>
    function create_default_slot$4(ctx) {
    	let checkbox;
    	let updating_group;
    	let current;

    	function checkbox_group_binding(value) {
    		/*checkbox_group_binding*/ ctx[3](value);
    	}

    	let checkbox_props = { value: /*layer*/ ctx[5].id };

    	if (/*group*/ ctx[0] !== void 0) {
    		checkbox_props.group = /*group*/ ctx[0];
    	}

    	checkbox = new Checkbox({ props: checkbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(checkbox, 'group', checkbox_group_binding));
    	checkbox.$on("change", /*onChange*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const checkbox_changes = {};
    			if (dirty & /*mapLayersArray*/ 2) checkbox_changes.value = /*layer*/ ctx[5].id;

    			if (!updating_group && dirty & /*group*/ 1) {
    				updating_group = true;
    				checkbox_changes.group = /*group*/ ctx[0];
    				add_flush_callback(() => updating_group = false);
    			}

    			checkbox.$set(checkbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(44:12) <FormField>",
    		ctx
    	});

    	return block;
    }

    // (46:16) 
    function create_label_slot$1(ctx) {
    	let span;
    	let t_value = /*layer*/ ctx[5].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "slot", "label");
    			add_location(span, file$8, 45, 16, 1448);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*mapLayersArray*/ 2 && t_value !== (t_value = /*layer*/ ctx[5].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_label_slot$1.name,
    		type: "slot",
    		source: "(46:16) ",
    		ctx
    	});

    	return block;
    }

    // (42:4) {#each mapLayersArray as layer}
    function create_each_block$2(ctx) {
    	let div;
    	let formfield;
    	let t;
    	let current;

    	formfield = new FormField({
    			props: {
    				$$slots: {
    					label: [create_label_slot$1],
    					default: [create_default_slot$4]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(formfield.$$.fragment);
    			t = space();
    			add_location(div, file$8, 42, 8, 1321);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(formfield, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formfield_changes = {};

    			if (dirty & /*$$scope, mapLayersArray, group*/ 259) {
    				formfield_changes.$$scope = { dirty, ctx };
    			}

    			formfield.$set(formfield_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(formfield);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(42:4) {#each mapLayersArray as layer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let current;
    	let each_value = /*mapLayersArray*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(div, file$8, 40, 0, 1269);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*mapLayersArray, group, onChange*/ 7) {
    				each_value = /*mapLayersArray*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayerTreeIcgc', slots, []);

    	let { mapLayersArray = [
    		{
    			id: "building",
    			name: "Edificis",
    			layout: { visibility: "none" }
    		},
    		{
    			id: "place",
    			name: "Llocs",
    			layout: { visibility: "visible" }
    		},
    		{
    			id: "water",
    			name: "Aigua",
    			layout: { visibility: "none" }
    		}
    	] } = $$props;

    	let { group = [] } = $$props;
    	const dispatch = createEventDispatcher();

    	onMount(async () => {
    		if (group.length === 0) {
    			$$invalidate(0, group = mapLayersArray.map(function (layer) {
    				if (layer && layer.layout && layer.layout.visibility == "visible") {
    					return layer.id;
    				}
    			}));
    		}
    	});

    	function onChange(event) {
    		const visible = event.target.checked ? "visible" : "none";

    		dispatch("Change", {
    			e: event,
    			layers: group,
    			id: event.target.value,
    			checked: event.target.checked,
    			layout: { visibility: visible }
    		});
    	}

    	const writable_props = ['mapLayersArray', 'group'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LayerTreeIcgc> was created with unknown prop '${key}'`);
    	});

    	function checkbox_group_binding(value) {
    		group = value;
    		$$invalidate(0, group);
    	}

    	$$self.$$set = $$props => {
    		if ('mapLayersArray' in $$props) $$invalidate(1, mapLayersArray = $$props.mapLayersArray);
    		if ('group' in $$props) $$invalidate(0, group = $$props.group);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		Checkbox,
    		FormField,
    		mapLayersArray,
    		group,
    		dispatch,
    		onChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('mapLayersArray' in $$props) $$invalidate(1, mapLayersArray = $$props.mapLayersArray);
    		if ('group' in $$props) $$invalidate(0, group = $$props.group);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [group, mapLayersArray, onChange, checkbox_group_binding];
    }

    class LayerTreeIcgc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { mapLayersArray: 1, group: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayerTreeIcgc",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get mapLayersArray() {
    		throw new Error("<LayerTreeIcgc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mapLayersArray(value) {
    		throw new Error("<LayerTreeIcgc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<LayerTreeIcgc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<LayerTreeIcgc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\LayerGroupIcgc\LayerCheckBox.svelte generated by Svelte v3.44.3 */
    const file$7 = "src\\components\\LayerGroupIcgc\\LayerCheckBox.svelte";

    // (43:0) <FormField class="field" style="padding-left: 10px;">
    function create_default_slot$3(ctx) {
    	let checkbox;
    	let updating_checked;
    	let t0;
    	let span;
    	let t1_value = /*item*/ ctx[1].label + "";
    	let t1;
    	let current;

    	function checkbox_checked_binding(value) {
    		/*checkbox_checked_binding*/ ctx[4](value);
    	}

    	let checkbox_props = {};

    	if (/*activated*/ ctx[0] !== void 0) {
    		checkbox_props.checked = /*activated*/ ctx[0];
    	}

    	checkbox = new Checkbox({ props: checkbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(checkbox, 'checked', checkbox_checked_binding));

    	checkbox.$on("change", function () {
    		if (is_function(/*activateTheLayer*/ ctx[2](/*item*/ ctx[1], /*activated*/ ctx[0]))) /*activateTheLayer*/ ctx[2](/*item*/ ctx[1], /*activated*/ ctx[0]).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			attr_dev(span, "class", "labels svelte-qm23h7");
    			add_location(span, file$7, 46, 2, 963);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span, anchor);
    			append_dev(span, t1);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const checkbox_changes = {};

    			if (!updating_checked && dirty & /*activated*/ 1) {
    				updating_checked = true;
    				checkbox_changes.checked = /*activated*/ ctx[0];
    				add_flush_callback(() => updating_checked = false);
    			}

    			checkbox.$set(checkbox_changes);
    			if ((!current || dirty & /*item*/ 2) && t1_value !== (t1_value = /*item*/ ctx[1].label + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(43:0) <FormField class=\\\"field\\\" style=\\\"padding-left: 10px;\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let formfield;
    	let current;

    	formfield = new FormField({
    			props: {
    				class: "field",
    				style: "padding-left: 10px;",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formfield.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(formfield, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const formfield_changes = {};

    			if (dirty & /*$$scope, item, activated*/ 35) {
    				formfield_changes.$$scope = { dirty, ctx };
    			}

    			formfield.$set(formfield_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formfield, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayerCheckBox', slots, []);
    	let { activated = true } = $$props;
    	let { item } = $$props;
    	let { layersValue } = $$props;

    	function activateTheLayer(item, activated) {
    		$$invalidate(3, layersValue = `${item.label} : ${activated}`);
    	}

    	const writable_props = ['activated', 'item', 'layersValue'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LayerCheckBox> was created with unknown prop '${key}'`);
    	});

    	function checkbox_checked_binding(value) {
    		activated = value;
    		$$invalidate(0, activated);
    	}

    	$$self.$$set = $$props => {
    		if ('activated' in $$props) $$invalidate(0, activated = $$props.activated);
    		if ('item' in $$props) $$invalidate(1, item = $$props.item);
    		if ('layersValue' in $$props) $$invalidate(3, layersValue = $$props.layersValue);
    	};

    	$$self.$capture_state = () => ({
    		Checkbox,
    		FormField,
    		activated,
    		item,
    		layersValue,
    		activateTheLayer
    	});

    	$$self.$inject_state = $$props => {
    		if ('activated' in $$props) $$invalidate(0, activated = $$props.activated);
    		if ('item' in $$props) $$invalidate(1, item = $$props.item);
    		if ('layersValue' in $$props) $$invalidate(3, layersValue = $$props.layersValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activated, item, activateTheLayer, layersValue, checkbox_checked_binding];
    }

    class LayerCheckBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { activated: 0, item: 1, layersValue: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayerCheckBox",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[1] === undefined && !('item' in props)) {
    			console.warn("<LayerCheckBox> was created without expected prop 'item'");
    		}

    		if (/*layersValue*/ ctx[3] === undefined && !('layersValue' in props)) {
    			console.warn("<LayerCheckBox> was created without expected prop 'layersValue'");
    		}
    	}

    	get activated() {
    		throw new Error("<LayerCheckBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activated(value) {
    		throw new Error("<LayerCheckBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get item() {
    		throw new Error("<LayerCheckBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<LayerCheckBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get layersValue() {
    		throw new Error("<LayerCheckBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set layersValue(value) {
    		throw new Error("<LayerCheckBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\LayerGroupIcgc\LayerGroupIcgc.svelte generated by Svelte v3.44.3 */
    const file$6 = "src\\components\\LayerGroupIcgc\\LayerGroupIcgc.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (77:4) {#if display}
    function create_if_block(ctx) {
    	let div;
    	let t;
    	let div_id_value;
    	let current;
    	let if_block = /*layer*/ ctx[0].groupId !== 'opt_elements' && create_if_block_1(ctx);
    	let each_value = /*layer*/ ctx[0].items;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", div_id_value = /*layer*/ ctx[0].groupId);
    			attr_dev(div, "class", "checkboxes svelte-1j87ynp");
    			add_location(div, file$6, 77, 6, 1748);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*layer*/ ctx[0].groupId !== 'opt_elements') {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*layer*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*layer, activated, layersValue*/ 21) {
    				each_value = /*layer*/ ctx[0].items;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*layer*/ 1 && div_id_value !== (div_id_value = /*layer*/ ctx[0].groupId)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(77:4) {#if display}",
    		ctx
    	});

    	return block;
    }

    // (79:8) {#if layer.groupId !== 'opt_elements'}
    function create_if_block_1(ctx) {
    	let div;
    	let formfield;
    	let current;

    	formfield = new FormField({
    			props: {
    				$$slots: {
    					label: [create_label_slot],
    					default: [create_default_slot$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(formfield.$$.fragment);
    			add_location(div, file$6, 79, 10, 1851);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(formfield, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formfield_changes = {};

    			if (dirty & /*$$scope, activated, layer*/ 4101) {
    				formfield_changes.$$scope = { dirty, ctx };
    			}

    			formfield.$set(formfield_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(formfield);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(79:8) {#if layer.groupId !== 'opt_elements'}",
    		ctx
    	});

    	return block;
    }

    // (81:12) <FormField>
    function create_default_slot$2(ctx) {
    	let checkbox;
    	let updating_checked;
    	let current;

    	function checkbox_checked_binding(value) {
    		/*checkbox_checked_binding*/ ctx[7](value);
    	}

    	let checkbox_props = { class: "indentedfield" };

    	if (/*activated*/ ctx[2] !== void 0) {
    		checkbox_props.checked = /*activated*/ ctx[2];
    	}

    	checkbox = new Checkbox({ props: checkbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(checkbox, 'checked', checkbox_checked_binding));

    	checkbox.$on("change", function () {
    		if (is_function(/*activateTheLayerGroup*/ ctx[5](/*layer*/ ctx[0], /*activated*/ ctx[2]))) /*activateTheLayerGroup*/ ctx[5](/*layer*/ ctx[0], /*activated*/ ctx[2]).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const checkbox_changes = {};

    			if (!updating_checked && dirty & /*activated*/ 4) {
    				updating_checked = true;
    				checkbox_changes.checked = /*activated*/ ctx[2];
    				add_flush_callback(() => updating_checked = false);
    			}

    			checkbox.$set(checkbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(81:12) <FormField>",
    		ctx
    	});

    	return block;
    }

    // (87:14) 
    function create_label_slot(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Visualitza-ho tot";
    			attr_dev(span, "class", "headCheck svelte-1j87ynp");
    			attr_dev(span, "slot", "label");
    			add_location(span, file$6, 86, 14, 2077);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_label_slot.name,
    		type: "slot",
    		source: "(87:14) ",
    		ctx
    	});

    	return block;
    }

    // (92:8) {#each layer.items as item, index}
    function create_each_block$1(ctx) {
    	let layercheckbox;
    	let updating_layersValue;
    	let current;

    	function layercheckbox_layersValue_binding(value) {
    		/*layercheckbox_layersValue_binding*/ ctx[8](value);
    	}

    	let layercheckbox_props = {
    		item: /*item*/ ctx[9],
    		activated: /*activated*/ ctx[2]
    	};

    	if (/*layersValue*/ ctx[4] !== void 0) {
    		layercheckbox_props.layersValue = /*layersValue*/ ctx[4];
    	}

    	layercheckbox = new LayerCheckBox({
    			props: layercheckbox_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(layercheckbox, 'layersValue', layercheckbox_layersValue_binding));

    	const block = {
    		c: function create() {
    			create_component(layercheckbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(layercheckbox, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layercheckbox_changes = {};
    			if (dirty & /*layer*/ 1) layercheckbox_changes.item = /*item*/ ctx[9];
    			if (dirty & /*activated*/ 4) layercheckbox_changes.activated = /*activated*/ ctx[2];

    			if (!updating_layersValue && dirty & /*layersValue*/ 16) {
    				updating_layersValue = true;
    				layercheckbox_changes.layersValue = /*layersValue*/ ctx[4];
    				add_flush_callback(() => updating_layersValue = false);
    			}

    			layercheckbox.$set(layercheckbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercheckbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercheckbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layercheckbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(92:8) {#each layer.items as item, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let form;
    	let div2;
    	let div1;
    	let div0;
    	let select;
    	let option;
    	let t0_value = /*layer*/ ctx[0].groupLabel + "";
    	let t0;
    	let option_value_value;
    	let t1;
    	let t2;
    	let pre0;
    	let t3;
    	let t4;
    	let t5;
    	let pre1;
    	let t6;
    	let t7;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*display*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			select = element("select");
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			pre0 = element("pre");
    			t3 = text("Group OnChange: ");
    			t4 = text(/*totValue*/ ctx[3]);
    			t5 = space();
    			pre1 = element("pre");
    			t6 = text("Layers OnChange: ");
    			t7 = text(/*layersValue*/ ctx[4]);
    			option.__value = option_value_value = /*layer*/ ctx[0].groupLabel;
    			option.value = option.__value;
    			add_location(option, file$6, 71, 10, 1639);
    			attr_dev(select, "class", "select svelte-1j87ynp");
    			set_style(select, "border-radius", "11px");
    			set_style(select, "border-color", "transparent");
    			set_style(select, "background-color", "rgb(147 211 195)");
    			add_location(select, file$6, 67, 8, 1474);
    			set_style(div0, "width", "100%");
    			attr_dev(div0, "class", "selectBox svelte-1j87ynp");
    			add_location(div0, file$6, 66, 6, 1398);
    			set_style(div1, "display", "flex");
    			set_style(div1, "height", "32px");
    			set_style(div1, "padding-bottom", "19px");
    			add_location(div1, file$6, 64, 4, 1316);
    			attr_dev(div2, "class", "multiselect svelte-1j87ynp");
    			add_location(div2, file$6, 63, 2, 1285);
    			add_location(form, file$6, 62, 0, 1275);
    			attr_dev(pre0, "class", "status");
    			add_location(pre0, file$6, 98, 0, 2372);
    			attr_dev(pre1, "class", "status");
    			add_location(pre1, file$6, 99, 0, 2426);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, select);
    			append_dev(select, option);
    			append_dev(option, t0);
    			append_dev(div2, t1);
    			if (if_block) if_block.m(div2, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, pre0, anchor);
    			append_dev(pre0, t3);
    			append_dev(pre0, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, pre1, anchor);
    			append_dev(pre1, t6);
    			append_dev(pre1, t7);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*colapseGroup*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*layer*/ 1) && t0_value !== (t0_value = /*layer*/ ctx[0].groupLabel + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*layer*/ 1 && option_value_value !== (option_value_value = /*layer*/ ctx[0].groupLabel)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (/*display*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*display*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*totValue*/ 8) set_data_dev(t4, /*totValue*/ ctx[3]);
    			if (!current || dirty & /*layersValue*/ 16) set_data_dev(t7, /*layersValue*/ ctx[4]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(pre0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(pre1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayerGroupIcgc', slots, []);
    	let { layer } = $$props;
    	let display = false;
    	let activated = true;
    	let totValue;
    	let layersValue;

    	function activateTheLayerGroup(layer, activated) {
    		$$invalidate(3, totValue = `${layer.groupLabel} : ${activated}`);
    	}

    	function colapseGroup() {
    		$$invalidate(1, display = !display);
    	}

    	const writable_props = ['layer'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LayerGroupIcgc> was created with unknown prop '${key}'`);
    	});

    	function checkbox_checked_binding(value) {
    		activated = value;
    		$$invalidate(2, activated);
    	}

    	function layercheckbox_layersValue_binding(value) {
    		layersValue = value;
    		$$invalidate(4, layersValue);
    	}

    	$$self.$$set = $$props => {
    		if ('layer' in $$props) $$invalidate(0, layer = $$props.layer);
    	};

    	$$self.$capture_state = () => ({
    		LayerCheckBox,
    		Checkbox,
    		FormField,
    		layer,
    		display,
    		activated,
    		totValue,
    		layersValue,
    		activateTheLayerGroup,
    		colapseGroup
    	});

    	$$self.$inject_state = $$props => {
    		if ('layer' in $$props) $$invalidate(0, layer = $$props.layer);
    		if ('display' in $$props) $$invalidate(1, display = $$props.display);
    		if ('activated' in $$props) $$invalidate(2, activated = $$props.activated);
    		if ('totValue' in $$props) $$invalidate(3, totValue = $$props.totValue);
    		if ('layersValue' in $$props) $$invalidate(4, layersValue = $$props.layersValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		layer,
    		display,
    		activated,
    		totValue,
    		layersValue,
    		activateTheLayerGroup,
    		colapseGroup,
    		checkbox_checked_binding,
    		layercheckbox_layersValue_binding
    	];
    }

    class LayerGroupIcgc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { layer: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayerGroupIcgc",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*layer*/ ctx[0] === undefined && !('layer' in props)) {
    			console.warn("<LayerGroupIcgc> was created without expected prop 'layer'");
    		}
    	}

    	get layer() {
    		throw new Error("<LayerGroupIcgc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set layer(value) {
    		throw new Error("<LayerGroupIcgc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\LayerGroupIcgc\OverLayersIcgc.svelte generated by Svelte v3.44.3 */
    const file$5 = "src\\components\\LayerGroupIcgc\\OverLayersIcgc.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (31:4) {#each layerTree as layer, index}
    function create_each_block(ctx) {
    	let layergroupicgc;
    	let current;

    	layergroupicgc = new LayerGroupIcgc({
    			props: {
    				layer: /*layer*/ ctx[1],
    				activateTheLayer
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layergroupicgc.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(layergroupicgc, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layergroupicgc_changes = {};
    			if (dirty & /*layerTree*/ 1) layergroupicgc_changes.layer = /*layer*/ ctx[1];
    			layergroupicgc.$set(layergroupicgc_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layergroupicgc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layergroupicgc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layergroupicgc, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(31:4) {#each layerTree as layer, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div1;
    	let h3;
    	let t1;
    	let div0;
    	let current;
    	let each_value = /*layerTree*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Selector de capes:";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$5, 27, 2, 465);
    			attr_dev(div0, "id", "capaselect");
    			attr_dev(div0, "class", "container list svelte-1sky1jl");
    			add_location(div0, file$5, 29, 2, 498);
    			add_location(div1, file$5, 26, 0, 456);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*layerTree, activateTheLayer*/ 1) {
    				each_value = /*layerTree*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function activateTheLayer(item, activated) {
    	layersValue = `${item.label} : ${activated}`;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OverLayersIcgc', slots, []);
    	let { layerTree } = $$props;
    	const writable_props = ['layerTree'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OverLayersIcgc> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('layerTree' in $$props) $$invalidate(0, layerTree = $$props.layerTree);
    	};

    	$$self.$capture_state = () => ({
    		LayerGroupIcgc,
    		layerTree,
    		activateTheLayer
    	});

    	$$self.$inject_state = $$props => {
    		if ('layerTree' in $$props) $$invalidate(0, layerTree = $$props.layerTree);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [layerTree];
    }

    class OverLayersIcgc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { layerTree: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverLayersIcgc",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*layerTree*/ ctx[0] === undefined && !('layerTree' in props)) {
    			console.warn("<OverLayersIcgc> was created without expected prop 'layerTree'");
    		}
    	}

    	get layerTree() {
    		throw new Error("<OverLayersIcgc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set layerTree(value) {
    		throw new Error("<OverLayersIcgc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SliderOpacityIcgc.svelte generated by Svelte v3.44.3 */

    const file$4 = "src\\components\\SliderOpacityIcgc.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let input;
    	let t0;
    	let pre;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			pre = element("pre");
    			t1 = text("Opacity OnChange: ");
    			t2 = text(/*opacity*/ ctx[0]);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", "100");
    			attr_dev(input, "step", "0");
    			input.value = "50";
    			attr_dev(input, "class", "svelte-1xf4lti");
    			add_location(input, file$4, 40, 4, 823);
    			attr_dev(div0, "class", "map-overlay-inner svelte-1xf4lti");
    			add_location(div0, file$4, 39, 2, 786);
    			attr_dev(pre, "class", "status");
    			add_location(pre, file$4, 48, 2, 965);
    			attr_dev(div1, "class", "map-overlay top svelte-1xf4lti");
    			add_location(div1, file$4, 38, 0, 753);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			append_dev(div1, t0);
    			append_dev(div1, pre);
    			append_dev(pre, t1);
    			append_dev(pre, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*changeOpacity*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*opacity*/ 1) set_data_dev(t2, /*opacity*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SliderOpacityIcgc', slots, []);
    	let opacity = "50";

    	function changeOpacity(e) {
    		$$invalidate(0, opacity = event.target.value);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SliderOpacityIcgc> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ opacity, changeOpacity });

    	$$self.$inject_state = $$props => {
    		if ('opacity' in $$props) $$invalidate(0, opacity = $$props.opacity);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [opacity, changeOpacity];
    }

    class SliderOpacityIcgc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SliderOpacityIcgc",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* node_modules\@smui\layout-grid\dist\InnerGrid.svelte generated by Svelte v3.44.3 */
    const file$3 = "node_modules\\@smui\\layout-grid\\dist\\InnerGrid.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();

    			attr_dev(div, "class", div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-layout-grid__inner': true
    			}));

    			add_location(div, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[7](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[3].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*className*/ 2 && div_class_value !== (div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-layout-grid__inner': true
    			}))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InnerGrid', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let element;

    	function getElement() {
    		return element;
    	}

    	const writable_props = ['use', 'class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InnerGrid> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('use' in $$props) $$invalidate(0, use = $$props.use);
    		if ('class' in $$props) $$invalidate(1, className = $$props.class);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$props => {
    		if ('use' in $$props) $$invalidate(0, use = $$props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		element,
    		forwardEvents,
    		getElement,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class InnerGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { use: 0, class: 1, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InnerGrid",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get use() {
    		throw new Error("<InnerGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<InnerGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<InnerGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<InnerGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<InnerGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\layout-grid\dist\LayoutGrid.svelte generated by Svelte v3.44.3 */
    const file$2 = "node_modules\\@smui\\layout-grid\\dist\\LayoutGrid.svelte";

    // (13:2) <InnerGrid {...prefixFilter($$restProps, 'innerGrid$')}>
    function create_default_slot$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(13:2) <InnerGrid {...prefixFilter($$restProps, 'innerGrid$')}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let innergrid;
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const innergrid_spread_levels = [prefixFilter(/*$$restProps*/ ctx[6], 'innerGrid$')];

    	let innergrid_props = {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < innergrid_spread_levels.length; i += 1) {
    		innergrid_props = assign(innergrid_props, innergrid_spread_levels[i]);
    	}

    	innergrid = new InnerGrid({ props: innergrid_props, $$inline: true });

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-layout-grid': true,
    				'mdc-layout-grid--fixed-column-width': /*fixedColumnWidth*/ ctx[2],
    				['mdc-layout-grid--align-' + /*align*/ ctx[3]]: /*align*/ ctx[3] != null
    			})
    		},
    		exclude(/*$$restProps*/ ctx[6], ['innerGrid$'])
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(innergrid.$$.fragment);
    			set_attributes(div, div_data);
    			add_location(div, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(innergrid, div, null);
    			/*div_binding*/ ctx[9](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[5].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const innergrid_changes = (dirty & /*prefixFilter, $$restProps*/ 64)
    			? get_spread_update(innergrid_spread_levels, [get_spread_object(prefixFilter(/*$$restProps*/ ctx[6], 'innerGrid$'))])
    			: {};

    			if (dirty & /*$$scope*/ 1024) {
    				innergrid_changes.$$scope = { dirty, ctx };
    			}

    			innergrid.$set(innergrid_changes);

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className, fixedColumnWidth, align*/ 14 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-layout-grid': true,
    					'mdc-layout-grid--fixed-column-width': /*fixedColumnWidth*/ ctx[2],
    					['mdc-layout-grid--align-' + /*align*/ ctx[3]]: /*align*/ ctx[3] != null
    				}))) && { class: div_class_value },
    				dirty & /*$$restProps*/ 64 && exclude(/*$$restProps*/ ctx[6], ['innerGrid$'])
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(innergrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(innergrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(innergrid);
    			/*div_binding*/ ctx[9](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","fixedColumnWidth","align","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayoutGrid', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { fixedColumnWidth = false } = $$props;
    	let { align = undefined } = $$props;
    	let element;

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(4, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('fixedColumnWidth' in $$new_props) $$invalidate(2, fixedColumnWidth = $$new_props.fixedColumnWidth);
    		if ('align' in $$new_props) $$invalidate(3, align = $$new_props.align);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		InnerGrid,
    		forwardEvents,
    		use,
    		className,
    		fixedColumnWidth,
    		align,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('fixedColumnWidth' in $$props) $$invalidate(2, fixedColumnWidth = $$new_props.fixedColumnWidth);
    		if ('align' in $$props) $$invalidate(3, align = $$new_props.align);
    		if ('element' in $$props) $$invalidate(4, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		fixedColumnWidth,
    		align,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		slots,
    		div_binding,
    		$$scope
    	];
    }

    class LayoutGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			use: 0,
    			class: 1,
    			fixedColumnWidth: 2,
    			align: 3,
    			getElement: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayoutGrid",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get use() {
    		throw new Error("<LayoutGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<LayoutGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<LayoutGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<LayoutGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixedColumnWidth() {
    		throw new Error("<LayoutGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixedColumnWidth(value) {
    		throw new Error("<LayoutGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<LayoutGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<LayoutGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[7];
    	}

    	set getElement(value) {
    		throw new Error("<LayoutGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\layout-grid\dist\Cell.svelte generated by Svelte v3.44.3 */
    const file$1 = "node_modules\\@smui\\layout-grid\\dist\\Cell.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-layout-grid__cell': true,
    				['mdc-layout-grid__cell--align-' + /*align*/ ctx[2]]: /*align*/ ctx[2] != null,
    				['mdc-layout-grid__cell--order-' + /*order*/ ctx[3]]: /*order*/ ctx[3] != null,
    				['mdc-layout-grid__cell--span-' + /*span*/ ctx[4]]: /*span*/ ctx[4] != null,
    				...Object.fromEntries(Object.entries(/*spanDevices*/ ctx[5]).map(func))
    			})
    		},
    		/*$$restProps*/ ctx[8]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[12](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className, align, order, span, spanDevices*/ 62 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-layout-grid__cell': true,
    					['mdc-layout-grid__cell--align-' + /*align*/ ctx[2]]: /*align*/ ctx[2] != null,
    					['mdc-layout-grid__cell--order-' + /*order*/ ctx[3]]: /*order*/ ctx[3] != null,
    					['mdc-layout-grid__cell--span-' + /*span*/ ctx[4]]: /*span*/ ctx[4] != null,
    					...Object.fromEntries(Object.entries(/*spanDevices*/ ctx[5]).map(func))
    				}))) && { class: div_class_value },
    				dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = ([device, span]) => [`mdc-layout-grid__cell--span-${span}-${device}`, true];

    function instance$1($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","align","order","span","spanDevices","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cell', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { align = undefined } = $$props;
    	let { order = undefined } = $$props;
    	let { span = undefined } = $$props;
    	let { spanDevices = {} } = $$props;
    	let element;

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(6, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('align' in $$new_props) $$invalidate(2, align = $$new_props.align);
    		if ('order' in $$new_props) $$invalidate(3, order = $$new_props.order);
    		if ('span' in $$new_props) $$invalidate(4, span = $$new_props.span);
    		if ('spanDevices' in $$new_props) $$invalidate(5, spanDevices = $$new_props.spanDevices);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		align,
    		order,
    		span,
    		spanDevices,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('align' in $$props) $$invalidate(2, align = $$new_props.align);
    		if ('order' in $$props) $$invalidate(3, order = $$new_props.order);
    		if ('span' in $$props) $$invalidate(4, span = $$new_props.span);
    		if ('spanDevices' in $$props) $$invalidate(5, spanDevices = $$new_props.spanDevices);
    		if ('element' in $$props) $$invalidate(6, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		align,
    		order,
    		span,
    		spanDevices,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Cell$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			use: 0,
    			class: 1,
    			align: 2,
    			order: 3,
    			span: 4,
    			spanDevices: 5,
    			getElement: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cell",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get use() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get order() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set order(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get span() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set span(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spanDevices() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spanDevices(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[9];
    	}

    	set getElement(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const Cell = Cell$1;

    /* src\App.svelte generated by Svelte v3.44.3 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (69:6) <Cell  style="border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center" span={2}>
    function create_default_slot_4(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let buttonicgc;
    	let current;

    	buttonicgc = new ButtonIcgc({
    			props: { label: "button" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "Button:";
    			t1 = space();
    			create_component(buttonicgc.$$.fragment);
    			add_location(h4, file, 70, 10, 2049);
    			add_location(div, file, 69, 8, 2032);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			mount_component(buttonicgc, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonicgc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonicgc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(buttonicgc);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(69:6) <Cell  style=\\\"border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center\\\" span={2}>",
    		ctx
    	});

    	return block;
    }

    // (75:6) <Cell style="border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center" span={2}>
    function create_default_slot_3(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let layertreeicgc;
    	let updating_group;
    	let t2;
    	let pre0;
    	let t3;
    	let t4_value = /*selected*/ ctx[0].join(", ") + "";
    	let t4;
    	let t5;
    	let pre1;
    	let t6;
    	let t7;
    	let current;

    	function layertreeicgc_group_binding(value) {
    		/*layertreeicgc_group_binding*/ ctx[6](value);
    	}

    	let layertreeicgc_props = {
    		mapLayersArray: /*mapLayersArray*/ ctx[2]
    	};

    	if (/*selected*/ ctx[0] !== void 0) {
    		layertreeicgc_props.group = /*selected*/ ctx[0];
    	}

    	layertreeicgc = new LayerTreeIcgc({
    			props: layertreeicgc_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(layertreeicgc, 'group', layertreeicgc_group_binding));
    	layertreeicgc.$on("Change", /*changeStatus*/ ctx[4]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "LayerTree:";
    			t1 = space();
    			create_component(layertreeicgc.$$.fragment);
    			t2 = space();
    			pre0 = element("pre");
    			t3 = text("Selected: ");
    			t4 = text(t4_value);
    			t5 = space();
    			pre1 = element("pre");
    			t6 = text("Onchange: ");
    			t7 = text(/*change*/ ctx[1]);
    			add_location(h4, file, 76, 10, 2271);
    			attr_dev(pre0, "class", "status");
    			add_location(pre0, file, 78, 10, 2395);
    			attr_dev(pre1, "class", "status");
    			add_location(pre1, file, 79, 10, 2464);
    			add_location(div, file, 75, 8, 2254);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			mount_component(layertreeicgc, div, null);
    			append_dev(div, t2);
    			append_dev(div, pre0);
    			append_dev(pre0, t3);
    			append_dev(pre0, t4);
    			append_dev(div, t5);
    			append_dev(div, pre1);
    			append_dev(pre1, t6);
    			append_dev(pre1, t7);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layertreeicgc_changes = {};

    			if (!updating_group && dirty & /*selected*/ 1) {
    				updating_group = true;
    				layertreeicgc_changes.group = /*selected*/ ctx[0];
    				add_flush_callback(() => updating_group = false);
    			}

    			layertreeicgc.$set(layertreeicgc_changes);
    			if ((!current || dirty & /*selected*/ 1) && t4_value !== (t4_value = /*selected*/ ctx[0].join(", ") + "")) set_data_dev(t4, t4_value);
    			if (!current || dirty & /*change*/ 2) set_data_dev(t7, /*change*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layertreeicgc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layertreeicgc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(layertreeicgc);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(75:6) <Cell style=\\\"border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center\\\" span={2}>",
    		ctx
    	});

    	return block;
    }

    // (83:6) <Cell style="border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center" span={2}>
    function create_default_slot_2(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let overlayersicgc;
    	let current;

    	overlayersicgc = new OverLayersIcgc({
    			props: { layerTree: /*layerTree*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "OverLayers:";
    			t1 = space();
    			create_component(overlayersicgc.$$.fragment);
    			add_location(h4, file, 84, 10, 2673);
    			add_location(div, file, 83, 8, 2656);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			mount_component(overlayersicgc, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overlayersicgc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overlayersicgc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(overlayersicgc);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(83:6) <Cell style=\\\"border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center\\\" span={2}>",
    		ctx
    	});

    	return block;
    }

    // (89:6) <Cell style="border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center" span={2}>
    function create_default_slot_1(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let slideropacityicgc;
    	let current;
    	slideropacityicgc = new SliderOpacityIcgc({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "SliderOpacity:";
    			t1 = space();
    			create_component(slideropacityicgc.$$.fragment);
    			add_location(h4, file, 90, 10, 2900);
    			add_location(div, file, 89, 8, 2883);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			mount_component(slideropacityicgc, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(slideropacityicgc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(slideropacityicgc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(slideropacityicgc);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(89:6) <Cell style=\\\"border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center\\\" span={2}>",
    		ctx
    	});

    	return block;
    }

    // (68:4) <LayoutGrid>
    function create_default_slot(ctx) {
    	let cell0;
    	let t0;
    	let cell1;
    	let t1;
    	let cell2;
    	let t2;
    	let cell3;
    	let current;

    	cell0 = new Cell({
    			props: {
    				style: "border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center",
    				span: 2,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cell1 = new Cell({
    			props: {
    				style: "border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center",
    				span: 2,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cell2 = new Cell({
    			props: {
    				style: "border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center",
    				span: 2,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cell3 = new Cell({
    			props: {
    				style: "border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center",
    				span: 2,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cell0.$$.fragment);
    			t0 = space();
    			create_component(cell1.$$.fragment);
    			t1 = space();
    			create_component(cell2.$$.fragment);
    			t2 = space();
    			create_component(cell3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cell0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cell1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(cell2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(cell3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cell0_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				cell0_changes.$$scope = { dirty, ctx };
    			}

    			cell0.$set(cell0_changes);
    			const cell1_changes = {};

    			if (dirty & /*$$scope, change, selected*/ 259) {
    				cell1_changes.$$scope = { dirty, ctx };
    			}

    			cell1.$set(cell1_changes);
    			const cell2_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				cell2_changes.$$scope = { dirty, ctx };
    			}

    			cell2.$set(cell2_changes);
    			const cell3_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				cell3_changes.$$scope = { dirty, ctx };
    			}

    			cell3.$set(cell3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell0.$$.fragment, local);
    			transition_in(cell1.$$.fragment, local);
    			transition_in(cell2.$$.fragment, local);
    			transition_in(cell3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell0.$$.fragment, local);
    			transition_out(cell1.$$.fragment, local);
    			transition_out(cell2.$$.fragment, local);
    			transition_out(cell3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cell0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cell1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(cell2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(cell3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(68:4) <LayoutGrid>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div0;
    	let logoicgc;
    	let t;
    	let div1;
    	let layoutgrid;
    	let current;

    	logoicgc = new LogoIcgc({
    			props: {
    				style: "padding-left: 2px;padding-top: 2px;",
    				type: "white"
    			},
    			$$inline: true
    		});

    	layoutgrid = new LayoutGrid({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			create_component(logoicgc.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(layoutgrid.$$.fragment);
    			set_style(div0, "background-color", "#F59E1B");
    			add_location(div0, file, 62, 2, 1761);
    			add_location(div1, file, 66, 2, 1891);
    			attr_dev(main, "class", "svelte-11cdqd1");
    			add_location(main, file, 61, 0, 1751);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			mount_component(logoicgc, div0, null);
    			append_dev(main, t);
    			append_dev(main, div1);
    			mount_component(layoutgrid, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layoutgrid_changes = {};

    			if (dirty & /*$$scope, change, selected*/ 259) {
    				layoutgrid_changes.$$scope = { dirty, ctx };
    			}

    			layoutgrid.$set(layoutgrid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logoicgc.$$.fragment, local);
    			transition_in(layoutgrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logoicgc.$$.fragment, local);
    			transition_out(layoutgrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(logoicgc);
    			destroy_component(layoutgrid);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;
    	let selected = ["water"];
    	let item = "Layer1";

    	let mapLayersArray = [
    		{
    			id: "building",
    			name: "Edificis2",
    			layout: { visibility: "none" }
    		},
    		{
    			id: "place",
    			name: "Llocs2",
    			layout: { visibility: "visible" }
    		},
    		{
    			id: "water",
    			name: "Aigua2",
    			layout: { visibility: "none" }
    		}
    	];

    	let change;

    	let layerTree = [
    		{
    			groupLabel: "Group 1",
    			groupId: "opt_group1",
    			items: [
    				{
    					label: "Layer 1",
    					id: "layer1",
    					layout: { visibility: "none" }
    				},
    				{
    					label: "Layer 2",
    					id: "layer2",
    					layout: { visibility: "none" }
    				},
    				{
    					label: "Layer 3",
    					id: "layer3",
    					layout: { visibility: "visible" }
    				}
    			]
    		},
    		{
    			groupLabel: "Group 2",
    			groupId: "opt_group2",
    			items: [
    				{ label: "Layer A", id: "layerA" },
    				{
    					label: "Layer B",
    					id: "layerB",
    					layout: { visibility: "none" }
    				},
    				{
    					label: "Layer C",
    					id: "layerC",
    					layout: { visibility: "none" }
    				}
    			]
    		}
    	];

    	function changeStatus(e) {
    		console.info(e.detail);
    		$$invalidate(1, change = `${e.detail.id} : ${e.detail.checked}`);
    	}

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function layertreeicgc_group_binding(value) {
    		selected = value;
    		$$invalidate(0, selected);
    	}

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(5, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		ButtonIcgc,
    		LogoIcgc,
    		LayerTreeIcgc,
    		OverLayersIcgc,
    		SliderOpacityIcgc,
    		LayoutGrid,
    		Cell,
    		name,
    		selected,
    		item,
    		mapLayersArray,
    		change,
    		layerTree,
    		changeStatus
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(5, name = $$props.name);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('item' in $$props) item = $$props.item;
    		if ('mapLayersArray' in $$props) $$invalidate(2, mapLayersArray = $$props.mapLayersArray);
    		if ('change' in $$props) $$invalidate(1, change = $$props.change);
    		if ('layerTree' in $$props) $$invalidate(3, layerTree = $$props.layerTree);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selected,
    		change,
    		mapLayersArray,
    		layerTree,
    		changeStatus,
    		name,
    		layertreeicgc_group_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[5] === undefined && !('name' in props)) {
    			console_1.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
